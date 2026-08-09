# LOSTRPG サポートツール

TRPG「LOSTRPG」のキャラクターシート・キャンプシート・ヌシシートなどをブラウザ上で作成・管理できるサポートツールです。

- 公開URL: https://lostrpg.hibohiboo66-cloudflare.workers.dev
- リポジトリ: https://github.com/hibohiboo/lostrpg-cloudflare

## 主な機能

- キャラクターの作成・編集・一覧・詳細表示
- 成長記録（レコードシート）の作成・編集
- キャンプの作成・編集・一覧・詳細表示
- ヌシの作成・編集・一覧・詳細表示
- 画像アップロード（Cloudflare R2）
- ココフォリア／ユドナリウム／TRPGスタジオへのデータ出力
- パスワードによる編集・削除保護

## 技術スタック

| レイヤー | 技術 |
| --- | --- |
| フロントエンド | React 19 / Vite / React Router / Redux Toolkit（RTK Query） / MUI |
| バックエンド | Hono（Cloudflare Workers） |
| DB | Neon（サーバーレスPostgres） / Drizzle ORM |
| ストレージ | Cloudflare R2（画像） |
| バリデーション | Zod |
| モノレポ管理 | bun workspaces + Turborepo |

## モノレポ構成

Feature-Sliced Design (FSD) に近い階層でフロントエンドを構成しています。

```
apps/
  frontend/   … フロントエンド（React + Vite）
    src/
      app/      アプリ全体の設定（ルーティング・store）
      page/     ページ単位のコンポーネント
      features/ 画面の機能単位（編集フォームなど）
      entities/ ドメインごとのAPI・型・共通UI
      shared/   横断的な共通処理・UIコンポーネント
  backend/    … バックエンド（Hono / Cloudflare Workers）
    src/
      routes/       APIルート
      lib/db/       Drizzleスキーマ・DB接続
      lib/r2/       画像アップロード処理
      middleware/   認証・エラーハンドリング
packages/
  core/       … ゲームデータ（特技・アビリティ・クラス・アイテム等）
  schemas/    … Zodバリデーションスキーマ（フロント/バック共通）
  ui/         … 共通UIコンポーネント・レイアウト
  eslint-config-custom/ … 共通ESLint設定
  typescript-config/    … 共通tsconfig
```

## セットアップ

### 前提

- [Bun](https://bun.sh/) 1.3系
- Docker（ローカルDBを利用する場合）

### インストール

```bash
bun install
```

### 環境変数

`.dev.vars.sample` をコピーして `.dev.vars` を作成し、値を設定してください。

```bash
cp .dev.vars.sample .dev.vars
```

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/lostrpg
PORT=3001
NODE_ENV=development
BUCKET_PUBLIC_URL=https://pub-hoge.r2.dev
```

## 開発

### ローカルDBの起動（Docker）

```bash
bun run db:up    # 起動
bun run db:down  # 停止
```

### 開発サーバーの起動

フロントエンド・バックエンド・UIパッケージを同時に起動します。

```bash
bun run dev
```

ローカルDBのマイグレーションも含めて起動する場合:

```bash
bun run dev:full
```

個別に起動する場合:

```bash
bun run dev:frontend  # http://localhost:5173
bun run dev:backend   # Wrangler dev
bun run dev:ui        # Storybook
```

### DBマイグレーション（apps/backend）

```bash
cd apps/backend
bun run db:generate  # マイグレーションファイル生成
bun run db:migrate   # マイグレーション適用
bun run db:studio    # Drizzle Studioで中身を確認
```

## ビルド・テスト・Lint

```bash
bun run build   # 全パッケージをビルド（Turborepo）
bun run lint    # 全パッケージをLint
bun run test    # 全パッケージのテストを実行
```

## デプロイ

Cloudflare Workers にデプロイします（`apps/backend` 配下）。

```bash
cd apps/backend
bun run deploy           # 本番
bun run deploy:staging   # ステージング
```

フロントエンドは `apps/frontend/dist` を Cloudflare Workers の静的アセットとして配信します（`wrangler.jsonc` 参照）。
