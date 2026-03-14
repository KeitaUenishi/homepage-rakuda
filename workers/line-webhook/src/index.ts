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
  RESEND_API_KEY: string;
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
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // パスによる分岐
    if (url.pathname === "/api/reservation") {
      return handleReservation(request, env);
    }

    // 以降は LINE Webhook 処理
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
    const results: any[] = [];

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
        if (event.replyToken) {
          await replyToLine(
            event.replyToken,
            "登録する権限が設定されていません。@ウエニシケイタ に権限追加を依頼してください",
            env,
          );
        }
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
        if (event.replyToken) {
          await replyToLine(
            event.replyToken,
            "⚠️ 短時間に複数のリクエストを送信しています。少し時間をおいてから再度お試しください。",
            env,
          );
        }
        results.push({ eventId, status: "failed", reason: "rate_limit" });
        continue; // 次のイベントへ
      }

      // 6. テンプレ解析
      try {
        if (text.startsWith("#delete")) {
          // 削除処理
          const deleteId = parseDeleteTemplate(text);
          if (!deleteId) {
            throw new Error(
              "削除対象の ID が指定されていないか、形式が正しくありません。",
            );
          }

          // 1. KV からパスを取得
          const pathKey = `path:${deleteId}`;
          let filePath = await env.KV.get(pathKey);

          if (!filePath) {
            // KV にない場合、GitHub の content/live 以下の全ファイルを検索して ID を探す (フォールバック)
            console.info(`ID ${deleteId} not found in KV, searching GitHub...`);
            filePath = await findFilePathByIdInGitHub(deleteId, env);

            if (filePath) {
              // 見つかった場合、次回の高速化のために KV を更新
              await env.KV.put(pathKey, filePath, { expirationTtl: 31536000 });
            }
          }

          if (!filePath) {
            if (event.replyToken) {
              await replyToLine(
                event.replyToken,
                `❌ 削除に失敗しました。\n\n指定された ID (${deleteId}) に対応するファイルが見つかりませんでした。すでに削除されているか、IDが間違っている可能性があります。`,
                env,
              );
            }
            results.push({
              eventId,
              status: "failed",
              reason: "not_found",
              id: deleteId,
            });
            continue;
          }

          // 2. GitHub から削除
          await deleteFromGitHub(filePath, `delete: ${deleteId}`, env);

          // 3. KV からマッピングを削除
          await env.KV.delete(pathKey);

          // 4. LINE に返信
          if (event.replyToken) {
            await replyToLine(
              event.replyToken,
              `🗑️ ライブ情報を削除しました。\n\nID: ${deleteId}\n対象ファイル: ${filePath}`,
              env,
            );
          }

          results.push({
            eventId,
            status: "success",
            type: "delete",
            id: deleteId,
          });
          continue;
        }

        if (text.startsWith("#release")) {
          // リリース処理 (preview -> main マージ)
          await mergePreviewToMain(env);

          if (event.replyToken) {
            await replyToLine(
              event.replyToken,
              "🚀 リリース（マージ）が完了しました！\n本番環境への反映が開始されます。\n反映まで数分お待ちください。",
              env,
            );
          }
          results.push({ eventId, status: "success", type: "release" });
          continue;
        }

        if (!text.startsWith("#live")) {
          // #news 等は現在サポート外
          if (text.startsWith("#")) {
            if (event.replyToken) {
              await replyToLine(
                event.replyToken,
                `❌ 「${text.split("\n")[0]}」コマンドは現在サポートされていません。利用可能なコマンドは #live, #delete, #release です。`,
                env,
              );
            }
            results.push({
              eventId,
              status: "failed",
              reason: "unsupported_command",
              text,
            });
            continue;
          }
          continue;
        }

        const liveData = parseLiveTemplate(text);
        liveData.id = crypto.randomUUID(); // 固有IDを生成
        const mdxContent = generateLiveMDX(liveData);
        const slug = generateSlug(liveData.title);
        const filePath = `content/live/${liveData.date}-${slug}.mdx`;
        const encodedPath = filePath
          .split("/")
          .map((segment) => encodeURIComponent(segment))
          .join("/");

        // 7. GitHub APIでコミット
        const commitResult = await commitToGitHub(
          filePath,
          mdxContent,
          `live: ${liveData.title}`,
          env,
        );

        // 8. ID とパスのマッピングを KV に保存（削除用）
        await env.KV.put(`path:${liveData.id}`, filePath, {
          expirationTtl: 31536000,
        }); // 1年間保持

        // 9. LINEに返信
        if (event.replyToken) {
          const replyMessage = [
            "✅ ライブ情報を登録しました！",
            "",
            `ID: ${liveData.id}`,
            `タイトル: ${liveData.title}`,
            `日付: ${liveData.date}`,
            `会場: ${liveData.venue}`,
            "",
            `登録ファイルのURL: https://github.com/${env.GH_OWNER}/${env.GH_REPO}/blob/${env.GH_BRANCH}/${encodedPath}`,
            "",
            `プレビュー中のサイトURL: https://preview.homepage-rakuda.pages.dev`,
            "",
            "※現在はpreview環境に反映中です。本番環境への反映は「#release」コマンドを送信すると実行されます。",
            "※登録した情報を削除する場合は記載されているIDを指定して、以下のメッセージを送信してください。",
            "",
            "#delete",
            `id: ${liveData.id}`,
          ].join("\n");

          await replyToLine(event.replyToken, replyMessage, env);
        }

        // 10. 成功時、KVに記録
        await env.KV.put(idempotencyKey, "true", { expirationTtl: 86400 }); // 24h
        await env.KV.put(rateLimitKey, now.toString(), { expirationTtl: 60 });

        results.push({
          eventId,
          status: "success",
          type: "create",
          path: filePath,
          slug,
          sha: commitResult.content.sha,
        });
      } catch (err: any) {
        console.error(`Error processing event ${eventId}:`, err);
        if (event.replyToken) {
          await replyToLine(
            event.replyToken,
            `❌ エラーが発生しました。\n\n原因: ${err.message}`,
            env,
          );
        }
        results.push({ eventId, status: "failed", error: err.message });
        continue;
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
};

/**
 * LINE署名検証
 */
async function verifySignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const base64Sig = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return base64Sig === signature;
}

/**
 * 削除テンプレ解析
 */
function parseDeleteTemplate(text: string): string | null {
  const lines = text.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (line.toLowerCase().startsWith("id:")) {
      // 引用符や空白、末尾の記号などをより強力に除去
      return line
        .slice(3)
        .trim()
        .replace(/^["']|["']$/g, "")
        .trim();
    }
  }
  // 1行目に ID が直接書かれている場合 (#delete uuid...)
  const firstLineMatch = text.match(/^#delete\s+([a-zA-Z0-9-]+)/);
  if (firstLineMatch) {
    return firstLineMatch[1];
  }
  return null;
}

/**
 * ライブテンプレ解析
 */
function parseLiveTemplate(text: string) {
  const lines = text.split("\n").map((l) => l.trim());
  const data: any = {
    title: "",
    date: "",
    venue: "",
    openTime: "",
    startTime: "",
    price: "",
    subTitle: "",
    detailUrl: "",
    pickup: false,
    act: [],
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
  mdx += `id: "${data.id}"\n`;
  mdx += `title: "${escape(data.title)}"\n`;
  mdx += `subTitle: "${escape(data.subTitle || "")}"\n`;
  mdx += `date: "${data.date}"\n`;
  mdx += `status: "published"\n`;
  mdx += `venue: "${escape(data.venue)}"\n`;
  mdx += `openTime: "${data.openTime}"\n`;
  mdx += `startTime: "${data.startTime}"\n`;
  mdx += `price: "${escape(data.price)}"\n`;
  mdx += `pickup: ${data.pickup}\n`;
  if (data.detailUrl) {
    mdx += `detailUrl: "${escape(data.detailUrl)}"\n`;
  }
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
async function commitToGitHub(
  path: string,
  content: string,
  message: string,
  env: Env,
) {
  // 1. 環境変数のクリーンアップ（空白除去と、トークンプレフィックスの正規化）
  const owner = env.GH_OWNER.trim();
  const repo = env.GH_REPO.trim();
  const branch = env.GH_BRANCH.trim();
  const token = env.GH_TOKEN.trim().replace(/^(token|Bearer)\s+/i, "");

  // 2. パスをURL用に安全にエンコード（スラッシュは維持、各セグメントをエンコード）
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

  const commonHeaders = {
    Authorization: `token ${token}`, // より汎用的な 'token' プレフィックスを使用
    "User-Agent": "Cloudflare-Worker",
    Accept: "application/vnd.github.v3+json",
  };

  // 3. 既存ファイルのSHAを取得
  const getResp = await fetch(url + (branch ? `?ref=${branch}` : ""), {
    headers: commonHeaders,
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
    branch: branch,
  };

  if (sha) {
    putBody.sha = sha;
  }

  if (env.GH_COMMITTER_NAME?.trim() && env.GH_COMMITTER_EMAIL?.trim()) {
    putBody.committer = {
      name: env.GH_COMMITTER_NAME.trim(),
      email: env.GH_COMMITTER_EMAIL.trim(),
    };
  }

  const putResp = await fetch(url, {
    method: "PUT",
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(putBody),
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

  return (await putResp.json()) as any;
}

/**
 * GitHub APIでファイルを削除
 */
async function deleteFromGitHub(path: string, message: string, env: Env) {
  const owner = env.GH_OWNER.trim();
  const repo = env.GH_REPO.trim();
  const branch = env.GH_BRANCH.trim();
  const token = env.GH_TOKEN.trim().replace(/^(token|Bearer)\s+/i, "");

  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;

  const commonHeaders = {
    Authorization: `token ${token}`,
    "User-Agent": "Cloudflare-Worker",
    Accept: "application/vnd.github.v3+json",
  };

  // 1. ファイルの SHA を取得
  const getResp = await fetch(url + (branch ? `?ref=${branch}` : ""), {
    headers: commonHeaders,
  });

  if (getResp.status !== 200) {
    const errorText = await getResp.text();
    throw new Error(
      `GitHub GET Error (for delete): ${getResp.status} ${errorText}`,
    );
  }

  const data: any = await getResp.json();
  const sha = data.sha;

  // 2. 削除リクエスト
  const deleteResp = await fetch(url, {
    method: "DELETE",
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sha,
      branch,
    }),
  });

  if (!deleteResp.ok) {
    const errorText = await deleteResp.text();
    throw new Error(`GitHub DELETE Error: ${deleteResp.status} ${errorText}`);
  }

  return await deleteResp.json();
}

/**
 * GitHub 上のファイルを走査して ID に合致するファイルを探す (リアルタイム走査)
 */
async function findFilePathByIdInGitHub(
  targetId: string,
  env: Env,
): Promise<string | null> {
  const owner = env.GH_OWNER.trim();
  const repo = env.GH_REPO.trim();
  const branch = env.GH_BRANCH.trim();
  const token = env.GH_TOKEN.trim().replace(/^(token|Bearer)\s+/i, "");

  // 1. content/live 以下のファイル一覧を直接取得
  const dirUrl = `https://api.github.com/repos/${owner}/${repo}/contents/content/live?ref=${branch}`;

  const headers = {
    Authorization: `token ${token}`,
    "User-Agent": "Cloudflare-Worker",
    Accept: "application/vnd.github.v3+json",
  };

  const res = await fetch(dirUrl, { headers });

  if (!res.ok) {
    console.error(`GitHub API Error (List Dir): ${res.status}`);
    return null;
  }

  const files = (await res.json()) as any[];
  const mdxFiles = files.filter(
    (f) => f.type === "file" && f.name.endsWith(".mdx"),
  );

  // 2. 全 MDX ファイルの内容を並列で取得して ID を照合
  const results = await Promise.all(
    mdxFiles.map(async (file) => {
      try {
        // ファイルの生データを取得
        const fileRes = await fetch(file.url, { headers });
        if (!fileRes.ok) return null;

        const fileData = (await fileRes.json()) as any;
        // Base64 デコード (改行を除去)
        const binaryString = atob(fileData.content.replace(/\s/g, ""));

        // ID が一致するか確認 (正規表現でクォートの有無に対応)
        const idPattern = new RegExp(`id:\\s*["']?${targetId}["']?`, "i");
        if (idPattern.test(binaryString)) {
          return file.path;
        }
      } catch (e) {
        console.error(`Error checking file ${file.path}:`, e);
      }
      return null;
    }),
  );

  // 最初にマッチしたファイルパスを返す
  return results.find((path) => path !== null) || null;
}

/**
 * GitHub APIで preview ブランチを main にマージ
 */
async function mergePreviewToMain(env: Env) {
  const owner = env.GH_OWNER.trim();
  const repo = env.GH_REPO.trim();
  const token = env.GH_TOKEN.trim().replace(/^(token|Bearer)\s+/i, "");

  const url = `https://api.github.com/repos/${owner}/${repo}/merges`;

  const headers = {
    Authorization: `token ${token}`,
    "User-Agent": "Cloudflare-Worker",
    "Content-Type": "application/json",
    Accept: "application/vnd.github.v3+json",
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      base: "main",
      head: env.GH_BRANCH.trim(), // preview ブランチ (env.GH_BRANCH)
      commit_message: "chore: manual release from LINE",
    }),
  });

  if (res.status === 204) {
    // すでに最新（マージするものがない）
    return { status: "already_up_to_date" };
  }

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorText;
    } catch (e) {}

    if (res.status === 409) {
      throw new Error("マージ競合が発生しました。GitHub上で解決してください。");
    }
    throw new Error(`GitHub Merge Error: ${res.status} ${errorMessage}`);
  }

  return await res.json();
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
      Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      `LINE Reply Error: status=${res.status}, body=${errorText}, token=${env.LINE_CHANNEL_ACCESS_TOKEN.substring(0, 10)}...`,
    );
  }
}

/**
 * 予約情報を メール に通知
 */
async function handleReservation(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const { name, count, liveTitle, liveDate } = (await request.json()) as any;

    if (!name || !count || !liveTitle || !liveDate) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    const messageText = [
      "🎫 【チケット予約が入りました】",
      "",
      `公演: ${liveTitle}`,
      `日程: ${liveDate}`,
      `名前: ${name} 様`,
      `枚数: ${count} 枚`,
      "",
      "---",
      "このメールはシステムより自動送信されています。",
    ].join("\n");

    await sendEmailNotification(
      `【チケット予約】${liveTitle} - ${name}様`,
      messageText,
      env,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

/**
 * メール通知を送信 (Resendを使用)
 */
async function sendEmailNotification(subject: string, text: string, env: Env) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Ticket System <no-reply@rakudanokobux.org>",
      to: ["rakudanokobux@gmail.com"],
      subject: subject,
      text: text,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Resend API Error: ${res.status} ${errorText}`);
  }
}
