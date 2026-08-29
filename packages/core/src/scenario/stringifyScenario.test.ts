import { describe, expect, it } from 'vitest';
import { parseScenarioContent } from './parseScenarioContent';
import { stringifyScenario } from './stringifyScenario';

describe('stringifyScenario', () => {
  it('players/time/limit/cautionが全て空の場合、フェイズ部分だけを返すこと', () => {
    const result = stringifyScenario({ phases: [] });
    expect(result).toBe('');
  });

  it('players/time/limit/cautionをラウンドトリップできること', () => {
    const md = stringifyScenario({
      players: '3人',
      time: '3時間',
      limit: '4',
      caution: '時間は目安です',
      phases: [],
    });
    const reparsed = parseScenarioContent(md);

    expect(reparsed.players).toBe('3人');
    expect(reparsed.time).toBe('3時間');
    expect(reparsed.limit).toBe('4');
    expect(reparsed.caution).toBe('時間は目安です');
  });

  it('メタ情報とフェイズを両方含めてラウンドトリップできること', () => {
    const original = parseScenarioContent(
      ['## 3人 {.players}', '## キャンプフェイズ', '### プロローグ'].join('\n'),
    );

    const md = stringifyScenario(original);
    const reparsed = parseScenarioContent(md);

    expect(reparsed.players).toBe(original.players);
    expect(reparsed.phases).toEqual(original.phases);
  });

  it('cautionに改行が含まれる場合、1行にまとめてラウンドトリップできること', () => {
    const md = stringifyScenario({ caution: '1行目\n2行目', phases: [] });
    const reparsed = parseScenarioContent(md);

    expect(reparsed.caution).toBe('1行目 2行目');
  });

  it('ランダムエンカウント表を含めてラウンドトリップできること', () => {
    const original = parseScenarioContent(
      [
        '## ランダムエンカウント表 {.encounterTable}',
        '##### 表A {.table}',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 1 | オオカミ 1d6体 |',
        '## キャンプフェイズ',
        '### プロローグ',
      ].join('\n'),
    );

    const md = stringifyScenario(original);
    const reparsed = parseScenarioContent(md);

    expect(reparsed.encounterTables).toEqual(original.encounterTables);
    expect(reparsed.phases).toEqual(original.phases);
  });

  it('散策表・探索表・休憩表（2d6）を含めてラウンドトリップできること', () => {
    const original = parseScenarioContent(
      [
        '## 散策表 {.wanderTable}',
        '##### 表A {.table}',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 2 | 何も見つからない |',
        '| 12 | 大当たり |',
        '## 探索表 {.searchTable}',
        '##### 表A {.table}',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 7 | 平凡な発見 |',
        '## 休憩表 {.restTable}',
        '##### 表A {.table}',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 2 | 悪夢を見る |',
        '## キャンプフェイズ',
        '### プロローグ',
      ].join('\n'),
    );

    const md = stringifyScenario(original);
    const reparsed = parseScenarioContent(md);

    expect(reparsed.wanderTables).toEqual(original.wanderTables);
    expect(reparsed.searchTables).toEqual(original.searchTables);
    expect(reparsed.restTables).toEqual(original.restTables);
    expect(reparsed.phases).toEqual(original.phases);
  });

  it('一部のメタ情報のみ指定した場合、指定分だけ見出しが生成されること', () => {
    const md = stringifyScenario({ limit: '4', phases: [] });
    expect(md).toBe('## 4 {.limit}');

    const reparsed = parseScenarioContent(md);
    expect(reparsed.players).toBe('');
    expect(reparsed.time).toBe('');
    expect(reparsed.limit).toBe('4');
    expect(reparsed.caution).toBe('');
  });
});
