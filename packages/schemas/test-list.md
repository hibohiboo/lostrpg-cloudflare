# Schema バリデーション テストリスト - Age of Hero

**作成日**: 2025-09-13  
**対象**: Age of Hero キャラクター作成・管理のバリデーションスキーマ  
**責務**: API リクエストデータの型安全性・整合性チェック

## 🔄 データ構造修正対応

### ヒーロースキル・必殺技スキーマ更新 ✅ **完了**
- [x] **heroSkills スキーマ修正**: id+level → 完全なスキル情報セット（寛容なバリデーション）
  - [x] name (string, optional): スキル名
  - [x] level (number, optional, min: 0): 取得レベル  
  - [x] maxLevel (number, optional, min: 0): 最大レベル
  - [x] timing (string, optional): タイミング
  - [x] skill (string, optional): 対応技能
  - [x] target (string, optional): 対象
  - [x] range (string, optional): 射程
  - [x] cost (number, optional, min: 0): コスト
  - [x] effect (string, optional): 効果説明

- [x] **specialAttacks スキーマ修正**: id+level → 完全な必殺技情報セット（寛容なバリデーション）
  - [x] name (string, optional): 必殺技名
  - [x] level (number, optional, min: 0): 取得レベル
  - [x] maxLevel (number, optional, min: 0): 最大レベル
  - [x] timing (string, optional): タイミング
  - [x] skill (string, optional): 対応技能
  - [x] target (string, optional): 対象
  - [x] range (string, optional): 射程
  - [x] cost (number, optional, min: 0): コスト
  - [x] effect (string, optional): 効果説明

### 寛容なバリデーション対応 ✅ **完了**
- [x] **全フィールドoptional**: 空欄でも保存可能な設計
- [x] **name**: 必須制約を削除、50文字上限のみ維持
- [x] **selectedClasses**: 必須制約を削除、空配列デフォルト
- [x] **skillAllocations**: 空オブジェクトデフォルト
- [x] **heroSkills/specialAttacks**: 空配列デフォルト、全フィールドoptional
- [x] **items**: 空配列デフォルト

### バリデーション互換性対応
- [x] **型定義更新**: CreateCharacterRequest 型の自動更新
- [ ] **新旧スキーマ両方対応**: 移行期間中の互換性維持
- [ ] **エラーメッセージ更新**: 新フィールド対応のエラーメッセージ

## ✅ 既存バリデーション（修正不要）

### 基本キャラクター情報 ✅ **完了**
- [x] name: 1-50文字、必須
- [x] selectedClasses: 配列、長さ2、必須
- [x] abilityBonus: enum、オプショナル
- [x] skillAllocations: Record<string, number>, オプショナル

### セッション履歴バリデーション ✅ **完了**  
- [x] sessions: 配列、全フィールドオプショナル（寛容なバリデーション）
- [x] セッション追加時の構造検証
- [x] 数値フィールドの最小値チェック

### アクセス制御 ✅ **完了**
- [x] password: nullable string、オプショナル

## 📝 実装方針

### 修正手順
1. **スキーマ定義更新**: character.ts内のheroSkills/specialAttacksスキーマ
2. **型定義更新**: CreateCharacterRequest型の自動更新
3. **バックエンドテスト更新**: 新スキーマに対応したテストケース
4. **フロントエンド連携**: 新データ構造でのAPI呼び出し対応

### 技術スタック
- **Zod**: 型安全なバリデーションスキーマ
- **TypeScript**: 自動型推論によるタイプセーフティ
- **互換性**: 段階的移行による破綻回避

### 完了基準
- 新しいデータ構造でのバリデーション通過
- 既存機能の互換性維持
- TypeScript 型チェック通過
- バックエンド API テスト全通過