import { zValidator } from '@hono/zod-validator';
import { parseScenarioContent } from '@lostrpg/core/scenario/parseScenarioContent';
import { createScenarioSchema, getScenarioSchema, updateScenarioSchema } from '@lostrpg/schemas';
import bcrypt from 'bcryptjs';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { getDb } from '../lib/db/connection';
import { scenarios } from '../lib/db/schema';
import { validateImageFile, uploadImageToR2 } from '../lib/r2/image-upload';
import { requirePasswordAuth } from '../middleware/auth';
import type { Env } from '../types/cloudflare';

const listScenariosQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  name: z.string().trim().optional(),
});

export const scenariosRouter = new Hono<{ Bindings: Env }>()
  // Get scenarios (paginated, optionally filtered by name)
  .get('/', zValidator('query', listScenariosQuerySchema), async (c) => {
    const { offset, limit, name } = c.req.valid('query');

    const conditions = [
      name ? ilike(scenarios.name, `%${name}%`) : undefined,
      // 「一覧に表示しない」がONのシナリオは一覧から除外する（詳細への直接リンクは可）
      sql`COALESCE((${scenarios.data}->>'hideFromList')::boolean, false) = false`,
    ].filter((condition) => condition !== undefined);

    const scenarioList = await getDb()
      .select({
        id: scenarios.id,
        name: scenarios.name,
        createdAt: scenarios.createdAt,
        updatedAt: scenarios.updatedAt,
        imageUrl: sql<string | null>`${scenarios.data}->>'imageUrl'`,
      })
      .from(scenarios)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(scenarios.updatedAt))
      .limit(limit + 1)
      .offset(offset);

    const hasMore = scenarioList.length > limit;
    const data = scenarioList.slice(0, limit).map((scenario) => ({
      id: scenario.id,
      name: scenario.name,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
      imageUrl: scenario.imageUrl ?? undefined,
    }));

    return c.json({ data, hasMore });
  })
  // Create new scenario
  .post('/', zValidator('json', createScenarioSchema), async (c) => {
    const scenarioData = c.req.valid('json');

    // パスワードハッシュ化
    let passwordHash: string | undefined;
    if (scenarioData.password) {
      passwordHash = await bcrypt.hash(scenarioData.password, 12);
    }

    // パスワードを除いたデータを準備
    // eslint-disable-next-line sonarjs/no-unused-vars
    const { password: _password, ...dataWithoutPassword } = scenarioData;

    // 本文（Markdown）から players/time/limit/caution、フェイズ／シーン／イベント、
    // カスタム表（##### 表名 {.table.kind-xxx.dN.sM}）を構造化する
    // クライアントから送られたこれらの値は使わず、常に content から再生成する
    const { players, time, limit, caution, phases, customTables } = parseScenarioContent(
      scenarioData.content,
    );

    // データベースに保存
    const [newScenario] = await getDb()
      .insert(scenarios)
      .values({
        name: scenarioData.name,
        data: { ...dataWithoutPassword, players, time, limit, caution, phases, customTables },
        passwordHash,
      })
      .returning();

    const url = `/scenario/${newScenario.id}`;

    return c.json({ id: newScenario.id, url }, 201);
  })

  // Get scenario by ID
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.uuid('Invalid ID format'),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');

      const [scenario] = await getDb().select().from(scenarios).where(eq(scenarios.id, id));

      if (!scenario) {
        throw new HTTPException(404, { message: 'Scenario not found' });
      }

      const data = getScenarioSchema.parse(scenario.data);

      return c.json({
        id: scenario.id,
        name: scenario.name,
        createdAt: scenario.createdAt,
        updatedAt: scenario.updatedAt,
        isPasswordProtected: !!scenario.passwordHash,
        data,
      });
    },
  )

  // Update scenario
  .put(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
    zValidator('json', updateScenarioSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const requestBody = c.req.valid('json');

      const [scenario] = await getDb().select().from(scenarios).where(eq(scenarios.id, id));

      if (!scenario) {
        throw new HTTPException(404, { message: 'Scenario not found' });
      }

      // パスワード認証
      await requirePasswordAuth(scenario, requestBody.password);

      // パスワードを除いたデータを準備
      // eslint-disable-next-line sonarjs/no-unused-vars
      const { password: _password, ...dataWithoutPassword } = requestBody;

      // 本文（Markdown）から players/time/limit/caution、フェイズ／シーン／イベント、
      // カスタム表（##### 表名 {.table.kind-xxx.dN.sM}）を構造化する
      // クライアントから送られたこれらの値は使わず、常に content から再生成する
      const { players, time, limit, caution, phases, customTables } = parseScenarioContent(
        requestBody.content,
      );

      // 更新データの構築
      const updateData: {
        data: object;
        name: string;
        updatedAt: Date;
        passwordHash?: string;
      } = {
        data: { ...dataWithoutPassword, players, time, limit, caution, phases, customTables },
        name: requestBody.name || scenario.name,
        updatedAt: new Date(),
      };

      // パスワードが未設定で、新しくパスワードを設定する場合のみハッシュ化
      if (!scenario.passwordHash && requestBody.password) {
        updateData.passwordHash = await bcrypt.hash(requestBody.password, 12);
      }
      // 既にパスワードが設定されている場合は、passwordHashは更新しない

      // データベースを更新
      const [updatedScenario] = await getDb()
        .update(scenarios)
        .set(updateData)
        .where(eq(scenarios.id, id))
        .returning();

      return c.json(
        {
          id: updatedScenario.id,
          name: updatedScenario.name,
          createdAt: updatedScenario.createdAt,
          updatedAt: updatedScenario.updatedAt,
          ...dataWithoutPassword,
          players,
          time,
          limit,
          caution,
          phases,
          customTables,
        },
        200,
      );
    },
  )

  // Delete scenario
  .delete(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string().uuid('Invalid ID format'),
      }),
    ),
    zValidator(
      'json',
      z.object({
        password: z.string().nullable().optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      const { password } = c.req.valid('json');

      const [scenario] = await getDb().select().from(scenarios).where(eq(scenarios.id, id));

      if (!scenario) {
        throw new HTTPException(404, { message: 'Scenario not found' });
      }

      // パスワード認証
      await requirePasswordAuth(scenario, password ?? undefined);

      // データベースから削除
      await getDb().delete(scenarios).where(eq(scenarios.id, id));

      return c.json({ message: 'Scenario deleted successfully' }, 200);
    },
  )

  // Upload scenario image
  .post(
    '/:id/upload-image',
    zValidator(
      'param',
      z.object({
        id: z.string().uuid('Invalid ID format'),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid('param');
      if (!c.env.IMAGES_BUCKET) {
        throw new HTTPException(404, { message: 'Bucket not found' });
      }

      // シナリオの存在確認
      const [scenario] = await getDb().select().from(scenarios).where(eq(scenarios.id, id));

      if (!scenario) {
        throw new HTTPException(404, { message: 'Scenario not found' });
      }

      // multipart/form-dataから画像を取得
      const formData = await c.req.formData();
      const imageFile = formData.get('image') as File | null;
      const password = formData.get('password') as string | null;

      // パスワード認証
      await requirePasswordAuth(scenario, password ?? undefined);

      // 画像ファイルのバリデーション
      const validatedFile = validateImageFile(imageFile);

      // R2にアップロード
      const imageUrl = await uploadImageToR2(
        c.env.IMAGES_BUCKET,
        'scenarios',
        id,
        validatedFile,
      );

      // データベースのimageUrlを更新
      const scenarioData = scenario.data as Record<string, unknown>;
      const updatedData = {
        ...scenarioData,
        imageUrl,
      };

      await getDb()
        .update(scenarios)
        .set({
          data: updatedData,
          updatedAt: new Date(),
        })
        .where(eq(scenarios.id, id));

      return c.json({ imageUrl }, 200);
    },
  );
