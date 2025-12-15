import { pgTable, uuid, varchar, timestamp, jsonb, primaryKey } from 'drizzle-orm/pg-core';

export const characters = pgTable('characters', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  data: jsonb('data').notNull(), // キャラクターデータ全体をJSONBで格納
  passwordHash: varchar('password_hash', { length: 255 }), // パスワードハッシュ（オプション）
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;

export const bosses = pgTable('bosses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  data: jsonb('data').notNull(), // ボスデータ全体をJSONBで格納
  passwordHash: varchar('password_hash', { length: 255 }), // パスワードハッシュ（オプション）
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Boss = typeof bosses.$inferSelect;
export type NewBoss = typeof bosses.$inferInsert;

export const camps = pgTable('camps', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  data: jsonb('data').notNull(), // キャンプデータ全体をJSONBで格納
  passwordHash: varchar('password_hash', { length: 255 }), // パスワードハッシュ（オプション）
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Camp = typeof camps.$inferSelect;
export type NewCamp = typeof camps.$inferInsert;

export const scenarios = pgTable('scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  data: jsonb('data').notNull(), // シナリオデータ全体をJSONBで格納
  passwordHash: varchar('password_hash', { length: 255 }), // パスワードハッシュ（オプション）
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Scenario = typeof scenarios.$inferSelect;
export type NewScenario = typeof scenarios.$inferInsert;

export const records = pgTable('records', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  data: jsonb('data').notNull(), // レコードデータ全体をJSONBで格納
  passwordHash: varchar('password_hash', { length: 255 }), // パスワードハッシュ（オプション）
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Record = typeof records.$inferSelect;
export type NewRecord = typeof records.$inferInsert;

// campsとcharactersの関連テーブル（1対多）
export const campCharacters = pgTable('camp_characters', {
  campId: uuid('camp_id').notNull().references(() => camps.id, { onDelete: 'cascade' }),
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.campId, table.characterId] }),
]);

export type CampCharacter = typeof campCharacters.$inferSelect;
export type NewCampCharacter = typeof campCharacters.$inferInsert;

// charactersとrecordsの関連テーブル
export const characterRecords = pgTable('character_records', {
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  recordId: uuid('record_id').notNull().references(() => records.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.characterId, table.recordId] }),
]);

export type CharacterRecord = typeof characterRecords.$inferSelect;
export type NewCharacterRecord = typeof characterRecords.$inferInsert;
