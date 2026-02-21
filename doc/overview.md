# プロジェクト概要及び使用技術

## 1. プロジェクト概要
本プロジェクトは、ロックバンド「らくだのこぶX」の公式ホームページです。
Next.js（App Router）を用いて構築された静的サイトであり、ライブ情報などのコンテンツ管理（CMS機能）をLINEの公式アカウント（Bot）から行えるユニークなアーキテクチャを採用しています。
LINEから送信したメッセージをCloudflare Workersで受信し、GitHubの特定ブランチにMDXファイルを直接コミットすることで、Cloudflare Pagesによる自動デプロイ（再ビルド）をトリガーする仕組みとなっています。

また、サイト上から直接ライブの「チケット予約」を行う機能があり、予約内容は同じくCloudflare Workersを経由して、管理者のメールアドレス宛に通知（Resend APIを使用）されるようになっています。

## 2. システム構成・アーキテクチャ

### フロントエンド（Webサイト）
- **ホスティング**: Cloudflare Pages
- **フレームワーク**: Next.js 16.1.4 (App Router, Turbopack)
- **UIライブラリ**: React 19
- **スタイリング**: Tailwind CSS v4
- **コンテンツ管理**: MDX (Markdown + JSX) + `gray-matter`（フロントマター解析）
- **コード品質管理**: Biome (Linter / Formatter), TypeScript 5

### バックエンド（Webhook / APIサーバー）
- **ホスティング**: Cloudflare Workers (`workers/line-webhook` 配下)
- **言語**: TypeScript
- **データストア**: Cloudflare KV
  - 冪等性（Idempotency）の担保：同じLINEイベントIDの二重処理防止
  - レート制限：同一ユーザーからの短時間（5秒以内）の連続実行防止
  - ライブ情報のIDとMDXファイルパスの紐付けマッピング保存

### 外部連携API・サービス
- **LINE Messaging API**:
  - Webhookによる管理者からのメッセージ受信（ライブ追加、削除、リリース指示）
  - Reply APIを用いた処理結果の返信（成功・失敗・エラー詳細の通知）
- **GitHub API**:
  - Contents API (PUT/DELETE): MDXファイルの作成、更新、削除
  - Search API: ファイルの削除時に、該当IDを持つファイルを検索してパスを特定
  - Merges API (`POST /merges`): `preview` ブランチを `main` ブランチにマージし、本番デプロイをトリガーする
- **Resend API**:
  - サイトのチケット予約フォームから送信された内容を管理者（`uenishikeita@gmail.com`）へメールで通知する仕組み

## 3. 主要な機能とワークフロー

### 3-1. LINEからのコンテンツ管理（CMS）
管理者がLINE公式アカウントに特定のコマンドを送信することで、ライブ情報の管理と本番反映を行います。

1. **ライブ情報の追加/更新 (`#live`)**
   - テンプレートに従って公演情報を送信すると、Workerが内容を解析し、UUIDを発行。
   - MDXファイルとしてフォーマットし、GitHubの `preview` ブランチ（または指定ブランチ）にコミット。
   - LINEに登録完了のメッセージと、生成された一意のID、GitHubのファイルURLを返信。
2. **ライブ情報の削除 (`#delete`)**
   - `#delete` コマンドと共にIDを指定して送信。
   - WorkerがKVまたはGitHub Search APIから該当ファイルを特定し、GitHub上から削除コミットを実行。
3. **本番環境へのリリース (`#release`)**
   - `#release` コマンドを送信すると、`preview` ブランチの内容が `main` ブランチへマージされる。
   - GitHubの `main` へのプッシュを検知して、Cloudflare Pagesが本番環境のビルド・デプロイを自動実行。

### 3-2. チケット予約機能
1. サイト訪問者がライブ一覧から「チケット予約」ボタンをクリック。
2. 予約モーダル（Client Component）が開き、名前と枚数を入力。
3. 確認ダイアログを経てフォームを送信すると、Cloudflare Workerの専用エンドポイント（`/api/reservation`）へPOSTリクエストが飛ぶ。
4. WorkerがResend APIを呼び出し、指定された管理者のメールアドレス宛に予約内容を自動送信。

## 4. プロジェクトのディレクトリ構造
```
.
├── content/
│   ├── live/                 # ライブ情報のMDXファイル格納ディレクトリ
│   ├── news/                 # （将来用）ニュース記事
│   └── release/              # （将来用）リリース情報
├── doc/
│   └── overview.md           # 本ドキュメントファイル
├── src/
│   ├── app/                  # Next.js App Router (ページコンポーネント)
│   ├── components/           # 共通UIコンポーネント (LiveCard, ReservationModal 等)
│   ├── lib/                  # ユーティリティ (mdx.ts によるファイル読み込みロジック等)
│   └── types/                # TypeScript型定義 (content.ts 等)
├── workers/
│   └── line-webhook/         # Cloudflare Workers のソースコード
│       ├── src/index.ts      # Webhookおよび予約APIのメインロジック
│       └── wrangler.toml     # Workerの環境・デプロイ設定
├── package.json              # フロントエンド用パッケージ設定
├── tsconfig.json             # TypeScript設定 (workersディレクトリは除外設定済)
└── biome.json                # Biome設定
```