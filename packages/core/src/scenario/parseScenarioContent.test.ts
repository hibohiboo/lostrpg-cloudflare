import { describe, expect, it } from 'vitest';
import { scenarioSamples } from '../game-data/scenario';
import { parseScenarioContent, splitScenarioIntro } from './parseScenarioContent';

describe('parseScenarioContent', () => {
  it('記法例（scenarioSamples）が全てエラーなく構造化でき、想定するフェイズ名になること', () => {
    scenarioSamples.forEach((sample) => {
      const result = parseScenarioContent(sample.content);
      expect(result.phases.map((p) => p.name)).toEqual([
        'キャンプフェイズ',
        '探索フェイズ',
        '決戦フェイズ',
        '結果フェイズ',
      ]);
    });
  });

  it('本文が空でもエラーにならず空のフェイズを返すこと', () => {
    const result = parseScenarioContent('');
    expect(result.phases).toEqual([]);
    expect(result.lines).toEqual([]);
    expect(result.customTables).toEqual([]);
  });

  it('フェイズ見出し直下の地の文をシナリオ概要として扱うこと（フェイズ開始前）', () => {
    const result = parseScenarioContent('シナリオの概要です。');
    expect(result.lines).toEqual(['シナリオの概要です。']);
  });

  it('players/time/limit/caution 特殊見出しの値を取り出せること', () => {
    const result = parseScenarioContent(
      [
        '## 〇人 {.players}',
        '## 〇時間 {.time}',
        '## 3 {.limit}',
        '## 注意事項です {.caution}',
      ].join('\n'),
    );
    expect(result.players).toBe('〇人');
    expect(result.time).toBe('〇時間');
    expect(result.limit).toBe('3');
    expect(result.caution).toBe('注意事項です');
    expect(result.phases).toEqual([]);
  });

  it('フェイズ・シーン・イベントの階層を構造化できること', () => {
    const md = [
      '## キャンプフェイズ',
      '### プロローグ',
      '#### 描写',
      'シナリオのモチベーションです',
    ].join('\n');

    const result = parseScenarioContent(md);

    expect(result.phases).toEqual([
      {
        name: 'キャンプフェイズ',
        scenes: [
          {
            name: 'プロローグ',
            type: null,
            alias: null,
            next: null,
            lines: [],
            events: [
              {
                name: '描写',
                type: 'view',
                lines: ['シナリオのモチベーションです'],
                items: [],
                tables: [],
                links: [],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('シーン見出しの type/alias/next 属性を解釈できること', () => {
    const md = [
      '## 探索フェイズ',
      '### 道 {.type-path.alias-mainroad.next-a-b}',
    ].join('\n');

    const result = parseScenarioContent(md);
    const scene = result.phases[0].scenes[0];
    expect(scene.type).toBe('path');
    expect(scene.alias).toBe('mainroad');
    expect(scene.next).toEqual(['a', 'b']);
  });

  it('##### 見出しで item/roll/path/prize を items に追加できること', () => {
    const md = [
      '## 探索フェイズ',
      '### チェックポイント',
      '#### 描写',
      '##### 道 {.path}',
      '##### 判定 {.roll}',
    ].join('\n');

    const result = parseScenarioContent(md);
    const event = result.phases[0].scenes[0].events[0];
    expect(event.items).toEqual([
      { type: 'path', name: '道' },
      { type: 'roll', name: '判定' },
    ]);
  });

  it('##### {.table} の直後の表を tables に追加できること', () => {
    const md = [
      '## 決戦フェイズ',
      '### 決戦の場',
      '#### 結果表 {.roll}',
      '##### 出目表 {.table}',
      '| 出目 | 結果 |',
      '| --- | --- |',
      '| 1 | 失敗 |',
      '| 2-6 | 成功 |',
    ].join('\n');

    const result = parseScenarioContent(md);
    const event = result.phases[0].scenes[0].events[0];
    expect(event.tables).toEqual([
      {
        title: '出目表',
        columns: ['出目', '結果'],
        rows: [{ cells: ['1', '失敗'] }, { cells: ['2-6', '成功'] }],
      },
    ]);
  });

  it('単独行のMarkdownリンクを links として扱うこと', () => {
    const md = [
      '## 決戦フェイズ',
      '### 決戦の場',
      '#### ヌシ {.scenario}',
      '[→ヌシシートへのリンク](https://example.com/scenario?id=abc)',
    ].join('\n');

    const result = parseScenarioContent(md);
    const event = result.phases[0].scenes[0].events[0];
    expect(event.links).toEqual([
      { url: 'https://example.com/scenario?id=abc', value: '→ヌシシートへのリンク' },
    ]);
    expect(event.lines).toEqual([]);
  });

  it('## 〇〇 {.customTable} セクションをカスタム表として取り出し、フェイズには含めないこと', () => {
    const md = [
      '## 3人 {.players}',
      '## カスタム表 {.customTable}',
      '##### 表A {.table.kind-encounter.dice-1d6}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | オオカミ 1d6体 |',
      '| 6 | 表B参照 |',
      '##### 表B {.table.kind-wander.dice-2d6}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 7 | 平凡な発見 |',
      '## キャンプフェイズ',
      '### プロローグ',
    ].join('\n');

    const result = parseScenarioContent(md);

    expect(result.players).toBe('3人');
    expect(result.customTables.map((t) => ({ name: t.name, kind: t.kind }))).toEqual([
      { name: '表A', kind: 'encounter' },
      { name: '表B', kind: 'wander' },
    ]);
    expect(result.customTables[0].rows[0]).toEqual({ roll: 1, text: 'オオカミ 1d6体' });
    expect(result.customTables[1].rows).toHaveLength(11);
    expect(result.phases.map((p) => p.name)).toEqual(['キャンプフェイズ']);
  });

  it('.customTable} セクションが本文の途中（フェイズとフェイズの間）にあっても取り出せること', () => {
    const md = [
      '## キャンプフェイズ',
      '### プロローグ',
      '## カスタム表 {.customTable}',
      '##### 表A {.table}',
      '| 出目 | 内容 |',
      '| --- | --- |',
      '| 1 | オオカミ |',
      '## 探索フェイズ',
      '### 道',
    ].join('\n');

    const result = parseScenarioContent(md);

    expect(result.customTables.map((t) => t.name)).toEqual(['表A']);
    expect(result.phases.map((p) => p.name)).toEqual(['キャンプフェイズ', '探索フェイズ']);
  });

  it('複数フェイズ・複数シーンを正しく積み上げること', () => {
    const md = [
      '## 探索フェイズ',
      '### チェックポイント',
      '#### 描写',
      'チェックポイントの描写です',
      '### 道',
      '#### 障害',
      '障害について説明します',
      '## 結果フェイズ',
      '### エピローグ',
    ].join('\n');

    const result = parseScenarioContent(md);
    expect(result.phases).toHaveLength(2);
    expect(result.phases[0].name).toBe('探索フェイズ');
    expect(result.phases[0].scenes.map((s) => s.name)).toEqual([
      'チェックポイント',
      '道',
    ]);
    expect(result.phases[1].name).toBe('結果フェイズ');
    expect(result.phases[1].scenes.map((s) => s.name)).toEqual(['エピローグ']);
  });
});

describe('splitScenarioIntro', () => {
  it('タイトル・概要文・メタ見出しをintroとして切り出せること', () => {
    const md = [
      '# タイトル',
      '',
      '## 3人 {.players}',
      '',
      '概要文です。',
      '',
      '## キャンプフェイズ',
      '### プロローグ',
    ].join('\n');

    const { intro, phasesMarkdown } = splitScenarioIntro(md);

    expect(intro).toBe(['# タイトル', '', '## 3人 {.players}', '', '概要文です。'].join('\n'));
    expect(parseScenarioContent(phasesMarkdown).phases.map((p) => p.name)).toEqual([
      'キャンプフェイズ',
    ]);
  });

  it('メタ見出しが無い場合はintroが空文字列になること', () => {
    const md = ['## キャンプフェイズ', '### プロローグ'].join('\n');
    const { intro, phasesMarkdown } = splitScenarioIntro(md);

    expect(intro).toBe('');
    expect(phasesMarkdown).toBe(md);
  });

  it('記法例（scenarioSamples）のintroを切り出した後もフェイズが揃うこと', () => {
    scenarioSamples.forEach((sample) => {
      const { phasesMarkdown } = splitScenarioIntro(sample.content);
      const { phases } = parseScenarioContent(phasesMarkdown);
      expect(phases.map((p) => p.name)).toEqual([
        'キャンプフェイズ',
        '探索フェイズ',
        '決戦フェイズ',
        '結果フェイズ',
      ]);
    });
  });
});
