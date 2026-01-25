# LINE Webhook Worker for Rakuda no Kobu X

LINE公式アカウントからの投稿をトリガーに、サイトのライブ情報を自動更新するCloudflare Workerです。

## 機能
- LINE Webhook署名検証 (X-Line-Signature)
- 投稿者制限 (ADMIN_USER_IDS)
- 冪等性チェック (eventId単位の重複排除)
- レート制限 (同一ユーザーの5秒以内の連投制限)
- テンプレ解析 (#live)
- GitHub APIによる自動コミット

## セットアップ手順

### 1. KV Namespaceの作成
Cloudflare DashboardまたはwranglerでKVを作成します。
```bash
npx wrangler kv:namespace create PROCESSED_EVENTS
```
出力された `id` を `wrangler.toml` の `[[kv_namespaces]]` セクションに設定してください。

### 2. Secretsの設定
以下の秘密情報を設定します。
```bash
npx wrangler secret put LINE_CHANNEL_SECRET
npx wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
npx wrangler secret put GH_TOKEN
npx wrangler secret put ADMIN_USER_IDS
npx wrangler secret put GH_OWNER
npx wrangler secret put GH_REPO
npx wrangler secret put GH_BRANCH
```

| 変数名 | 説明 |
| :--- | :--- |
| `LINE_CHANNEL_SECRET` | LINE Developers の Channel Secret |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Developers の チャネルアクセストークン |
| `GH_TOKEN` | GitHub の Personal Access Token (repo スコープが必要) |
| `ADMIN_USER_IDS` | 投稿を許可するLINEユーザーID (カンマ区切り) |
| `GH_OWNER` | GitHub リポジトリの所有者名 |
| `GH_REPO` | GitHub リポジトリ名 |
| `GH_BRANCH` | コミット対象のブランチ名 (例: `main`) |

### 3. デプロイ
```bash
npx wrangler deploy
```

## LINE側の設定
1. LINE Developers の Webhook settings で、デプロイしたWorkerのURLを設定。
   - URL例: `https://line-webhook.<your-subdomain>.workers.dev/`
2. "Verify" ボタンを押して 200 が返ることを確認。
3. "Use webhook" を ON に設定。

## 投稿テンプレ (#live)
以下の形式でLINEからメッセージを送信してください。

```text
#live
title: テストライブ
subTitle: サブタイトル（任意）
date: 2026-03-10
venue: ライブハウス名
openTime: 18:30
startTime: 19:00
price: ¥2,500
act:
  - バンドA
  - バンドB
```

## 動作確認
1. LINEから上記テンプレを投稿。
2. GitHubリポジトリの `content/live/2026-03-10-test-live.mdx` が作成/更新されることを確認。
3. Cloudflare Pages のビルドが自動的に開始され、サイトに反映されることを確認。


