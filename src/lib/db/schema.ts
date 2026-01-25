/**
 * Drizzle ORMスキーマ定義（将来のD1対応用）
 *
 * 現時点では未使用。
 * Cloudflare D1 + Drizzle導入時にここにスキーマを定義する。
 *
 * src/types/content.ts の型定義を基にしたスキーマ設計。
 */

// D1導入時のサンプルスキーマ（コメントアウト）
/*
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// コンテンツテーブル
export const contents = sqliteTable('contents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  category: text('category', { enum: ['news', 'live', 'release'] }).notNull(),
  title: text('title').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  content: text('content').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// タグテーブル
export const contentTags = sqliteTable('content_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contentId: integer('content_id').notNull().references(() => contents.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
});

// 画像テーブル
export const contentImages = sqliteTable('content_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contentId: integer('content_id').notNull().references(() => contents.id, { onDelete: 'cascade' }),
  imagePath: text('image_path').notNull(),
  order: integer('order').notNull().default(0),
});

// リレーション定義
export const contentsRelations = relations(contents, ({ many }) => ({
  tags: many(contentTags),
  images: many(contentImages),
}));

export const contentTagsRelations = relations(contentTags, ({ one }) => ({
  content: one(contents, {
    fields: [contentTags.contentId],
    references: [contents.id],
  }),
}));

export const contentImagesRelations = relations(contentImages, ({ one }) => ({
  content: one(contents, {
    fields: [contentImages.contentId],
    references: [contents.id],
  }),
}));
*/

// 現時点ではプレースホルダーとしてexport
export const SCHEMA_VERSION = "0.0.0";



