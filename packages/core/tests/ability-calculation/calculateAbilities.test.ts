import { describe, it, expect } from 'vitest';
import { calculateAbilities } from '../../src/ability-calculation/calculateAbilities';

describe('calculateAbilities', () => {
  it.each([
    ['physical', 4],      // マッスル(3) + テクノロジー(1) = 4
    ['reflex', 4],        // マッスル(2) + テクノロジー(2) = 4
    ['sensory', 5],       // マッスル(2) + テクノロジー(3) = 5
    ['intellectual', 3],  // マッスル(1) + テクノロジー(2) = 3
    ['supernatural', 0],  // マッスル(0) + テクノロジー(0) = 0
  ] as const)(
    'マッスルとテクノロジーの%s能力値を正しく合算すること',
    (abilityName, expected) => {
      const result = calculateAbilities(['マッスル', 'テクノロジー']);

      expect(result[abilityName]).toBe(expected);
    },
  );

  it('同一クラス2つ選択時に能力値を2倍すること', () => {
    // マッスル + マッスル = マッスル × 2
    const result = calculateAbilities(['マッスル', 'マッスル']);
    
    expect(result.physical).toBe(6); // 3 * 2 = 6
    expect(result.reflex).toBe(4);   // 2 * 2 = 4
  });

  it('+1ボーナスを指定した能力値に適用すること', () => {
    // マッスル(3) + テクノロジー(1) = 4, physicalに+1ボーナス = 5
    const result = calculateAbilities(['マッスル', 'テクノロジー'], 'physical');
    
    expect(result.physical).toBe(5); // 4 + 1 = 5
    expect(result.reflex).toBe(4);   // ボーナス適用されず
  });

  it('HP/SP/行動値を正しく計算すること', () => {
    // マッスル(HP:38, SP:17) + テクノロジー(HP:30, SP:25)
    // 反射:4, 知力:3 なので 行動値 = 4*2 + 3 = 11
    const result = calculateAbilities(['マッスル', 'テクノロジー']);
    
    expect(result.hp).toBe(68);      // 38 + 30 = 68
    expect(result.sp).toBe(42);      // 17 + 25 = 42
    expect(result.actionValue).toBe(11); // 4*2 + 3 = 11
  });
});
