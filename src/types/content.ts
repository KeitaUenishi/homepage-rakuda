/**
 * コンテンツ関連の型定義
 * 将来的にD1/Drizzleへ移行する際はこの型を基にスキーマを定義する
 */

// 有効なカテゴリの型
export type Category = "news" | "live" | "release";

// コンテンツのステータス
export type ContentStatus = "draft" | "published";

// コンテンツのフロントマター
export interface ContentFrontmatter {
	title: string;
	date: string;
	tags: string[];
	status: ContentStatus;
	images?: string[];
	description?: string;
}

// ライブ情報のフロントマター
export interface LiveFrontmatter {
	title: string;
	subTitle?: string;
	date: string;
	status: ContentStatus;
	venue: string;
	openTime: string;
	startTime: string;
	price: string;
	pickup?: boolean;
	detailUrl?: string;
	act?: string[];
}

// ライブ情報アイテム（MDXパース後）
export interface LiveItem {
	slug: string;
	frontmatter: LiveFrontmatter;
	content: string;
}

// コンテンツアイテム（MDXパース後）
export interface ContentItem {
	slug: string;
	category: Category;
	frontmatter: ContentFrontmatter;
	content: string;
}

// コンテンツ一覧用（軽量版）
export interface ContentListItem {
	slug: string;
	category: Category;
	title: string;
	date: string;
	tags: string[];
}

/**
 * 将来的なD1/Drizzleスキーマの参考構造
 *
 * contents テーブル:
 * - id: integer (primary key, autoincrement)
 * - slug: text (unique, indexed)
 * - category: text (news | live | release)
 * - title: text
 * - date: text (YYYY-MM-DD)
 * - status: text (draft | published)
 * - content: text (MDX body)
 * - description: text (nullable)
 * - created_at: integer (unix timestamp)
 * - updated_at: integer (unix timestamp)
 *
 * content_tags テーブル:
 * - id: integer (primary key, autoincrement)
 * - content_id: integer (foreign key -> contents.id)
 * - tag: text
 *
 * content_images テーブル:
 * - id: integer (primary key, autoincrement)
 * - content_id: integer (foreign key -> contents.id)
 * - image_path: text
 * - order: integer
 */
