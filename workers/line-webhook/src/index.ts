/// <reference types="@cloudflare/workers-types" />

export interface Env {
  LINE_CHANNEL_SECRET: string;
  LINE_CHANNEL_ACCESS_TOKEN: string;
  ADMIN_USER_IDS: string;
  GH_TOKEN: string;
  GH_OWNER: string;
  GH_REPO: string;
  GH_BRANCH: string;
  GH_COMMITTER_NAME?: string;
  GH_COMMITTER_EMAIL?: string;
  KV: KVNamespace;
}

interface LineWebhookEvent {
  type: string;
  mode: string;
  timestamp: number;
  source: {
    type: string;
    userId: string;
  };
  webhookEventId: string;
  replyToken?: string;
  deliveryContext: {
    isRedelivery: boolean;
  };
  message?: {
    type: string;
    id: string;
    text: string;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const signature = request.headers.get("X-Line-Signature");
    if (!signature) {
      return new Response("Missing Signature", { status: 401 });
    }

    const body = await request.text();

    // 1. 署名検証
    if (!(await verifySignature(body, signature, env.LINE_CHANNEL_SECRET))) {
      return new Response("Invalid Signature", { status: 401 });
    }

    const payload: { events: LineWebhookEvent[] } = JSON.parse(body);
    const results = [];

    for (const event of payload.events) {
      // 2. テキストメッセージ以外は無視
      if (event.type !== "message" || event.message?.type !== "text") {
        continue;
      }

      const userId = event.source.userId;
      const eventId = event.webhookEventId;
      const text = event.message.text;

      // 3. 投稿者制限
      const adminIds = env.ADMIN_USER_IDS.split(",");
      if (!adminIds.includes(userId)) {
        console.warn(`Unauthorized user: ${userId}`);
        continue;
      }

      // 4. 冪等性チェック
      const idempotencyKey = `processed:${eventId}`;
      const isProcessed = await env.KV.get(idempotencyKey);
      if (isProcessed) {
        console.info(`Already processed event: ${eventId}`);
        results.push({ eventId, status: "skipped", reason: "idempotency" });
        continue;
      }

      // 5. レート制限 (5秒以内)
      const rateLimitKey = `ratelimit:${userId}`;
      const lastProcessTime = await env.KV.get(rateLimitKey);
      const now = Date.now();
      if (lastProcessTime && now - parseInt(lastProcessTime) < 5000) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
      }

      // 6. テンプレ解析
      try {
        if (!text.startsWith("#live")) {
          // #news 等は 400 エラー
          if (text.startsWith("#")) {
            return new Response(JSON.stringify({ error: "Only #live is supported in this release" }), { status: 400 });
          }
          continue; 
        }

        const liveData = parseLiveTemplate(text);
        const mdxContent = generateLiveMDX(liveData);
        const slug = generateSlug(liveData.title);
        const filePath = `content/live/${liveData.date}-${slug}.mdx`;

        // 7. GitHub APIでコミット
        const commitResult = await commitToGitHub(filePath, mdxContent, `live: ${liveData.title}`, env);

        // 8. LINEに返信
        if (event.replyToken) {
          await replyToLine(event.replyToken, `✅ ライブ情報を登録しました！\n\nタイトル: ${liveData.title}\n日付: ${liveData.date}\n会場: ${liveData.venue}\nURL: https://github.com/${env.GH_OWNER}/${env.GH_REPO}/blob/${env.GH_BRANCH}/${filePath}`, env);
        }

        // 9. 成功時、KVに記録
        await env.KV.put(idempotencyKey, "true", { expirationTtl: 86400 }); // 24h
        await env.KV.put(rateLimitKey, now.toString(), { expirationTtl: 60 });

        results.push({
          eventId,
          status: "success",
          path: filePath,
          slug,
          sha: commitResult.content.sha
        });

      } catch (err: any) {
        console.error(`Error processing event ${eventId}:`, err);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  },
};

/**
 * LINE署名検証
 */
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const base64Sig = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return base64Sig === signature;
}

/**
 * ライブテンプレ解析
 */
function parseLiveTemplate(text: string) {
  const lines = text.split("\n").map(l => l.trim());
  const data: any = {
    title: "",
    date: "",
    venue: "",
    openTime: "",
    startTime: "",
    price: "",
    subTitle: "",
    pickup: false,
    act: []
  };

  let currentKey = "";
  for (const line of lines) {
    if (line === "#live") continue;

    if (line.startsWith("act:")) {
      currentKey = "act";
      continue;
    }

    if (currentKey === "act" && line.startsWith("-")) {
      data.act.push(line.replace(/^-/, "").trim());
      continue;
    }

    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      if (key in data) {
        if (key === "pickup") {
          data[key] = value.toLowerCase() === "true";
        } else {
          data[key] = value;
        }
        currentKey = key;
      }
    }
  }

  // 必須チェック
  const required = ["title", "date", "venue", "openTime", "startTime", "price"];
  for (const key of required) {
    if (!data[key]) {
      // dateが空なら今日の日付を入れる
      if (key === "date") {
        data.date = new Date().toISOString().split("T")[0];
      } else {
        throw new Error(`Missing required field: ${key}`);
      }
    }
  }

  return data;
}

/**
 * MDX生成 (厳密なキー順とフォーマット)
 */
function generateLiveMDX(data: any): string {
  const escape = (str: string) => str.replace(/"/g, '\\"');
  
  let mdx = "---\n";
  mdx += `title: "${escape(data.title)}"\n`;
  mdx += `subTitle: "${escape(data.subTitle || "")}"\n`;
  mdx += `date: "${data.date}"\n`;
  mdx += `status: "published"\n`;
  mdx += `venue: "${escape(data.venue)}"\n`;
  mdx += `openTime: "${data.openTime}"\n`;
  mdx += `startTime: "${data.startTime}"\n`;
  mdx += `price: "${escape(data.price)}"\n`;
  mdx += `pickup: ${data.pickup}\n`;
  mdx += `act:\n`;
  if (data.act && data.act.length > 0) {
    for (const a of data.act) {
      mdx += `  - "${escape(a)}"\n`;
    }
  }
  mdx += "---\n";
  
  return mdx;
}

/**
 * Slug生成
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * GitHub APIでコミット
 */
async function commitToGitHub(path: string, content: string, message: string, env: Env) {
  // 1. 環境変数のクリーンアップ（空白除去と、トークンプレフィックスの正規化）
  const owner = env.GH_OWNER.trim();
  const repo = env.GH_REPO.trim();
  const branch = env.GH_BRANCH.trim();
  const token = env.GH_TOKEN.trim().replace(/^(token|Bearer)\s+/i, "");

  // 2. パスをURL用に安全にエンコード（スラッシュは維持、各セグメントをエンコード）
  const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  
  const commonHeaders = {
    "Authorization": `token ${token}`, // より汎用的な 'token' プレフィックスを使用
    "User-Agent": "Cloudflare-Worker",
    "Accept": "application/vnd.github.v3+json"
  };

  // 3. 既存ファイルのSHAを取得
  const getResp = await fetch(url + (branch ? `?ref=${branch}` : ""), {
    headers: commonHeaders
  });

  let sha: string | undefined;
  if (getResp.status === 200) {
    const data: any = await getResp.json();
    sha = data.sha;
  } else if (getResp.status !== 404) {
    // 404以外（401, 403, 400等）はここでエラーを出して詳細を確認
    const errorText = await getResp.text();
    throw new Error(`GitHub GET Error: ${getResp.status} ${errorText}`);
  }

  // 4. Base64エンコード (Workersで安全なバイナリ文字列変換)
  const bytes = new TextEncoder().encode(content);
  let binString = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  const base64Content = btoa(binString);

  // 5. ファイルをPUT
  const putBody: any = {
    message,
    content: base64Content,
    branch: branch
  };
  
  if (sha) {
    putBody.sha = sha;
  }
  
  if (env.GH_COMMITTER_NAME?.trim() && env.GH_COMMITTER_EMAIL?.trim()) {
    putBody.committer = {
      name: env.GH_COMMITTER_NAME.trim(),
      email: env.GH_COMMITTER_EMAIL.trim()
    };
  }

  const putResp = await fetch(url, {
    method: "PUT",
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(putBody)
  });

  if (!putResp.ok) {
    // エラー時にJSONパースに失敗しても内容が見えるように text() で取得
    const errorText = await putResp.text();
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorText;
    } catch (e) {
      // JSONでない場合はそのままのテキストを使用
    }
    throw new Error(`GitHub PUT Error: ${putResp.status} ${errorMessage}`);
  }

  return await putResp.json() as any;
}

/**
 * LINEに返信を送信
 */
async function replyToLine(replyToken: string, text: string, env: Env) {
  const url = "https://api.line.me/v2/bot/message/reply";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      replyToken,
      messages: [
        {
          type: "text",
          text
        }
      ]
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`LINE Reply Error: ${res.status} ${errorText}`);
  }
}


