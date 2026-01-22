/**
 * データベース接続モジュール（将来のD1/Drizzle対応用）
 *
 * 現時点では未使用。
 * Cloudflare D1 + Drizzle導入時にここに実装を追加する。
 *
 * 導入時の手順:
 * 1. npm install drizzle-orm @cloudflare/workers-types
 * 2. npm install -D drizzle-kit
 * 3. このファイルにDrizzleクライアントの初期化処理を実装
 * 4. src/lib/db/schema.ts にスキーマ定義を追加
 * 5. src/lib/data.ts でD1からのデータ取得処理を実装
 *
 * 参考:
 * - https://orm.drizzle.team/docs/get-started-sqlite#cloudflare-d1
 * - https://developers.cloudflare.com/d1/
 */

// D1導入時のサンプルコード（コメントアウト）
/*
import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof createDb>;
*/

// 現時点ではプレースホルダーとしてexport
export const DB_READY = false;

