/**
 * MDXファイル操作ユーティリティ
 * 静的サイト生成用のコンテンツ読み込み処理
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
	Category,
	ContentFrontmatter,
	ContentItem,
	ContentListItem,
	LiveFrontmatter,
	LiveItem,
} from "@/types/content";

// コンテンツディレクトリのパス
const CONTENT_DIR = path.join(process.cwd(), "content");

// 有効なカテゴリ一覧
const VALID_CATEGORIES: Category[] = ["news", "live", "release"];

/**
 * 指定カテゴリのディレクトリパスを取得
 */
function getCategoryDir(category: Category): string {
	return path.join(CONTENT_DIR, category);
}

/**
 * ファイル名からslugを抽出（YYYY-MM-DD-slug.mdx -> slug）
 */
function extractSlug(filename: string): string {
	// 拡張子を除去
	const withoutExt = filename.replace(/\.mdx$/, "");
	// 日付プレフィックスを除去（YYYY-MM-DD-）
	const slug = withoutExt.replace(/^\d{4}-\d{2}-\d{2}-/, "");
	return slug;
}

/**
 * 指定カテゴリの全コンテンツファイル名を取得
 */
function getContentFiles(category: Category): string[] {
	const dir = getCategoryDir(category);

	if (!fs.existsSync(dir)) {
		return [];
	}

	return fs
		.readdirSync(dir)
		.filter((file) => file.endsWith(".mdx"))
		.sort()
		.reverse(); // 新しい順
}

/**
 * 単一のMDXファイルを読み込んでパース
 */
function parseContentFile(category: Category, filename: string): ContentItem | null {
	const filePath = path.join(getCategoryDir(category), filename);

	if (!fs.existsSync(filePath)) {
		return null;
	}

	const fileContent = fs.readFileSync(filePath, "utf-8");
	const { data, content } = matter(fileContent);

	const frontmatter: ContentFrontmatter = {
		title: data.title || "",
		date: data.date || "",
		tags: data.tags || [],
		status: data.status || "draft",
		images: data.images,
		description: data.description,
	};

	return {
		slug: extractSlug(filename),
		category,
		frontmatter,
		content,
	};
}

/**
 * 指定カテゴリの全コンテンツを取得
 */
export function getAllContent(category: Category): ContentItem[] {
	const files = getContentFiles(category);
	const items: ContentItem[] = [];

	for (const file of files) {
		const item = parseContentFile(category, file);
		if (item && item.frontmatter.status === "published") {
			items.push(item);
		}
	}

	return items;
}

/**
 * 指定カテゴリの全コンテンツ（一覧用軽量版）を取得
 */
export function getContentList(category: Category): ContentListItem[] {
	return getAllContent(category).map((item) => ({
		slug: item.slug,
		category: item.category,
		title: item.frontmatter.title,
		date: item.frontmatter.date,
		tags: item.frontmatter.tags,
	}));
}

/**
 * 全カテゴリの全コンテンツを取得
 */
export function getAllCategories(): ContentItem[] {
	const allContent: ContentItem[] = [];

	for (const category of VALID_CATEGORIES) {
		allContent.push(...getAllContent(category));
	}

	// 日付順（新しい順）でソート
	return allContent.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

/**
 * 指定カテゴリ・slugのコンテンツを取得
 */
export function getContentBySlug(category: Category, slug: string): ContentItem | null {
	const files = getContentFiles(category);

	for (const file of files) {
		if (file.includes(slug)) {
			const item = parseContentFile(category, file);
			if (item && item.frontmatter.status === "published") {
				return item;
			}
		}
	}

	return null;
}

/**
 * 静的生成用のパスパラメータを生成
 */
export function generateStaticParams(category: Category): { slug: string }[] {
	return getAllContent(category).map((item) => ({
		slug: item.slug,
	}));
}

/**
 * タグでフィルタリング
 */
export function getContentByTag(category: Category, tag: string): ContentItem[] {
	return getAllContent(category).filter((item) => item.frontmatter.tags.includes(tag));
}

/**
 * 全カテゴリから指定タグのコンテンツを取得
 */
export function getAllContentByTag(tag: string): ContentItem[] {
	return getAllCategories().filter((item) => item.frontmatter.tags.includes(tag));
}

/**
 * ライブ情報専用のパース関数
 */
function parseLiveFile(filename: string): LiveItem | null {
	const filePath = path.join(getCategoryDir("live"), filename);

	if (!fs.existsSync(filePath)) {
		return null;
	}

	const fileContent = fs.readFileSync(filePath, "utf-8");
	const { data, content } = matter(fileContent);

	const frontmatter: LiveFrontmatter = {
		title: data.title || "",
		subTitle: data.subTitle,
		date: data.date || "",
		status: data.status || "draft",
		venue: data.venue || "",
		openTime: data.openTime || "",
		startTime: data.startTime || "",
		price: data.price || "",
		pickup: data.pickup ?? false,
		detailUrl: data.detailUrl,
		act: data.act,
	};

	return {
		slug: extractSlug(filename),
		frontmatter,
		content,
	};
}

/**
 * 全ライブ情報を取得（日付順）
 */
export function getAllLives(): LiveItem[] {
	const files = getContentFiles("live");
	const items: LiveItem[] = [];

	for (const file of files) {
		const item = parseLiveFile(file);
		if (item && item.frontmatter.status === "published") {
			items.push(item);
		}
	}

	// 日付順（新しい順）でソート
	return items.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

/**
 * 今後のライブ情報を取得（日付の近い順）
 */
export function getUpcomingLives(limit?: number): LiveItem[] {
	const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
	const upcoming = getAllLives()
		.filter((item) => item.frontmatter.date >= today)
		.sort((a, b) => a.frontmatter.date.localeCompare(b.frontmatter.date)); // 近い順にソート

	if (limit) {
		return upcoming.slice(0, limit);
	}
	return upcoming;
}

/**
 * 過去のライブ情報を取得
 */
export function getPastLives(): LiveItem[] {
	const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
	return getAllLives().filter((item) => item.frontmatter.date < today);
}

/**
 * Pickup指定のライブ情報を取得（今後のライブのみ）
 */
export function getPickupLives(): LiveItem[] {
	return getUpcomingLives().filter((item) => item.frontmatter.pickup === true);
}

/**
 * 次回ライブ情報を取得（今後のライブのうち最も近い日付のもの）
 */
export function getNextLive(): LiveItem | null {
	const upcomingLives = getUpcomingLives();
	if (upcomingLives.length === 0) return null;
	// 日付昇順でソートして最初の要素を返す
	return upcomingLives.sort((a, b) => a.frontmatter.date.localeCompare(b.frontmatter.date))[0];
}



