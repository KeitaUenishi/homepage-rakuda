# homepage-rakuda

Next.js 16 + Tailwind CSS 4 によるホームページプロジェクト。

## 技術スタック

- **Framework**: Next.js 16.1.4 (App Router)
- **Styling**: Tailwind CSS 4
- **Linter/Formatter**: Biome
- **Content**: MDX + gray-matter
- **Language**: TypeScript 5

## セットアップ

```bash
npm install
npm run dev
```

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 (Turbopack) |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | Biome lint実行 |
| `npm run format` | Biome format実行 |
| `npm run check` | Biome lint + format チェック |
| `npm run check:fix` | Biome lint + format 自動修正 |

## ディレクトリ構造

```
homepage-rakuda/
├── content/           # MDXコンテンツ
│   ├── news/          # ニュース記事
│   ├── live/          # ライブ情報
│   └── release/       # リリース情報
├── src/
│   ├── app/           # Next.js App Router
│   ├── lib/           # ユーティリティ
│   │   ├── mdx.ts     # MDXファイル読み込み
│   │   ├── data.ts    # データアクセス層（抽象化）
│   │   └── db/        # 将来のDB接続用
│   │       ├── index.ts
│   │       └── schema.ts
│   └── types/         # 型定義
│       └── content.ts
├── biome.json         # Biome設定
└── package.json
```

## コンテンツの追加

### 1. 手動追加
`content/{category}/YYYY-MM-DD-{slug}.mdx` の形式でファイルを作成：

```mdx
---
title: "記事タイトル"
date: "2026-01-22"
tags: ["タグ1", "タグ2"]
status: "published"
---

本文をここに記述
```

### 2. LINEからの自動追加（ライブ情報のみ）
LINE公式アカウントから特定のテンプレートでメッセージを送信することで、自動的に `content/live/` にMDXファイルが生成・コミットされます。

詳細は `workers/line-webhook/README.md` を参照してください。

## 将来のD1/Drizzle移行について

### 移行手順

1. **依存関係のインストール**
   ```bash
   npm install drizzle-orm @cloudflare/workers-types
   npm install -D drizzle-kit
   ```

2. **Wrangler設定**
   ```bash
   npx wrangler d1 create homepage-rakuda-db
   ```
   `wrangler.toml` を作成してD1バインディングを設定。

3. **スキーマ定義**
   `src/lib/db/schema.ts` のコメントを解除してスキーマを有効化。

4. **マイグレーション**
   ```bash
   npx drizzle-kit generate:sqlite
   npx wrangler d1 migrations apply homepage-rakuda-db
   ```

5. **データアクセス層の切り替え**
   `src/lib/data.ts` でD1からのデータ取得処理を実装。
   `CURRENT_DATA_SOURCE` を `'d1'` に変更。

### 設計方針

- `src/types/content.ts` の型定義がスキーマのベース
- `src/lib/data.ts` がデータアクセスの抽象化層
- 使用側コードは `data.ts` 経由でアクセスすることで、データソース変更に対して透過的

## ライセンス

Private
