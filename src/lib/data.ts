/**
 * データアクセス層の抽象化
 *
 * 現在は静的MDXファイルからデータを取得しているが、
 * 将来的にCloudflare D1 + Drizzleへ移行する際は
 * このファイルの実装を差し替えることで対応可能。
 *
 * 使用側はこのモジュール経由でデータを取得することで、
 * データソースの変更に対して透過的になる。
 */

import type { Category, ContentItem, ContentListItem } from "@/types/content";
import {
	getAllCategories,
	getAllContent,
	getAllContentByTag,
	getContentBySlug,
	getContentByTag,
	getContentList,
} from "./mdx";

// 現在のデータソース種別
export type DataSource = "static" | "d1";

// 現在のデータソース（将来的に環境変数等で切り替え）
const CURRENT_DATA_SOURCE: DataSource = "static";

/**
 * 現在のデータソースを取得
 */
export function getDataSource(): DataSource {
	return CURRENT_DATA_SOURCE;
}

/**
 * 指定カテゴリの全コンテンツを取得
 */
export async function fetchAllContent(category: Category): Promise<ContentItem[]> {
	// 将来的にD1対応時はここで分岐
	// if (CURRENT_DATA_SOURCE === 'd1') {
	//   return await fetchFromD1(category);
	// }
	return getAllContent(category);
}

/**
 * 指定カテゴリのコンテンツ一覧（軽量版）を取得
 */
export async function fetchContentList(category: Category): Promise<ContentListItem[]> {
	return getContentList(category);
}

/**
 * 全カテゴリの全コンテンツを取得
 */
export async function fetchAllCategories(): Promise<ContentItem[]> {
	return getAllCategories();
}

/**
 * 指定カテゴリ・slugのコンテンツを取得
 */
export async function fetchContentBySlug(
	category: Category,
	slug: string,
): Promise<ContentItem | null> {
	return getContentBySlug(category, slug);
}

/**
 * タグでフィルタリング
 */
export async function fetchContentByTag(category: Category, tag: string): Promise<ContentItem[]> {
	return getContentByTag(category, tag);
}

/**
 * 全カテゴリから指定タグのコンテンツを取得
 */
export async function fetchAllContentByTag(tag: string): Promise<ContentItem[]> {
	return getAllContentByTag(tag);
}



