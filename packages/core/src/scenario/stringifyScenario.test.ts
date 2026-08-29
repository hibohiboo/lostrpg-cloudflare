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
