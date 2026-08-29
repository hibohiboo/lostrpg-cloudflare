import { describe, expect, it } from 'vitest';
import { scenarioSamples } from '../game-data/scenario';
import { parseScenarioContent, splitScenarioIntro } from './parseScenarioContent';
import { stringifyScenarioPhases } from './stringifyScenarioPhases';

describe('stringifyScenarioPhases', () => {
  it('空配列を渡すと空文字列を返すこと', () => {
    expect(stringifyScenarioPhases([])).toBe('');
  });

  it('フェイズ・シーン・イベントの階層をラウンドトリップできること', () => {
    const md = [
      '## キャンプフェイズ',
      '### プロローグ',
      '#### 描写',
      'シナリオのモチベーションです',
    ].join('\n');

    const { phases } = parseScenarioContent(md);
    const restringified = stringifyScenarioPhases(phases);
    const reparsed = parseScenarioContent(restringified);

    expect(reparsed.phases).toEqual(phases);
  });

  it('シーンのtype/alias/next属性をラウンドトリップできること', () => {
    const md = ['## 探索フェイズ', '### 道 {.type-path .alias-mainroad .next-a-b}'].join('\n');

    const { phases } = parseScenarioContent(md);
    const reparsed = parseScenarioContent(stringifyScenarioPhases(phases));

    expect(reparsed.phases).toEqual(phases);
  });

  it('items（item/roll/path/prize）をラウンドトリップできること', () => {
    const md = [
      '## 探索フェイズ',
      '### チェックポイント',
      '#### 描写',
      '##### 道 {.path}',
      '##### 判定 {.roll}',
    ].join('\n');

    const { phases } = parseScenarioContent(md);
    const reparsed = parseScenarioContent(stringifyScenarioPhases(phases));

    expect(reparsed.phases).toEqual(phases);
  });

  it('複数の表（表題あり・なし）が混ざらずラウンドトリップできること', () => {
    const md = [
      '## 決戦フェイズ',
      '### 決戦の場',
      '#### 結果表 {.roll}',
      '##### 出目表 {.table}',
      '| 出目 | 結果 |',
      '| --- | --- |',
      '| 1 | 失敗 |',
      '| 2-6 | 成功 |',
      '##### 別の表 {.table}',
      '| a | b |',
      '| --- | --- |',
      '| 1 | 2 |',
    ].join('\n');

    const { phases } = parseScenarioContent(md);
    const reparsed = parseScenarioContent(stringifyScenarioPhases(phases));

    expect(reparsed.phases).toEqual(phases);
    expect(reparsed.phases[0].scenes[0].events[0].tables).toHaveLength(2);
  });

  it('links（単独行リンク）をラウンドトリップできること', () => {
    const md = [
      '## 決戦フェイズ',
      '### 決戦の場',
      '#### ヌシ {.scenario}',
      '[→ヌシシートへのリンク](https://example.com/scenario?id=abc)',
    ].join('\n');

    const { phases } = parseScenarioContent(md);
    const reparsed = parseScenarioContent(stringifyScenarioPhases(phases));

    expect(reparsed.phases).toEqual(phases);
  });

  it('記法例（scenarioSamples）のフェイズ部分をラウンドトリップできること', () => {
    scenarioSamples.forEach((sample) => {
      const { phasesMarkdown } = splitScenarioIntro(sample.content);
      const { phases } = parseScenarioContent(phasesMarkdown);
      const reparsed = parseScenarioContent(stringifyScenarioPhases(phases));

      expect(reparsed.phases).toEqual(phases);
    });
  });
});
