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

  it('カスタム表（種別・ダイス設定が異なる複数表。d66も含む）を含めてラウンドトリップできること', () => {
    const original = parseScenarioContent(
      [
        '## カスタム表 {.customTable}',
        '##### 表A {.table.kind-encounter.dice-1d6}',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 1 | オオカミ 1d6体 |',
        '##### 表B {.table.kind-wander.dice-2d6}',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 2 | 何も見つからない |',
        '| 12 | 大当たり |',
        '##### 表C {.table.kind-search.dice-1d8}',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 8 | レアアイテム |',
        '##### 表D {.table.kind-other.dice-d66}',
        '| 出目 | 内容 |',
        '| --- | --- |',
        '| 66 | 大吉 |',
        '## キャンプフェイズ',
        '### プロローグ',
      ].join('\n'),
    );

    const md = stringifyScenario(original);
    const reparsed = parseScenarioContent(md);

    expect(reparsed.customTables).toEqual(original.customTables);
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
