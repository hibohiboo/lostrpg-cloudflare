import { describe, it, expect } from 'vitest';
import { calculateSkillInitialValues } from '../../src/skill-management/calculateSkillInitialValues';

describe('calculateSkillInitialValues', () => {
  it('肉体系技能（パワー）の初期値を physical×10 で計算すること', () => {
    // physical = 4 の場合、パワーの初期値は 4×10 = 40 となるべき
    const abilities = {
      physical: 4,
      reflex: 3,
      sensory: 2,
      intellectual: 1,
      supernatural: 0,
    };

    const result = calculateSkillInitialValues(abilities);

    expect(result.パワー).toBe(40); // physical(4) × 10 = 40
  });

  it('反射系技能（技術）の初期値を reflex×10 で計算すること', () => {
    // reflex = 3 の場合、技術の初期値は 3×10 = 30 となるべき
    const abilities = {
      physical: 4,
      reflex: 3,
      sensory: 2,
      intellectual: 1,
      supernatural: 0,
    };

    const result = calculateSkillInitialValues(abilities);

    expect(result.技術).toBe(30); // reflex(3) × 10 = 30
  });

  it.each([
    // 肉体系技能
    ['パワー', 'physical', 4, 40],
    ['タフネス', 'physical', 4, 40],
    ['スタミナ', 'physical', 4, 40],
    // 反射系技能
    ['技術', 'reflex', 3, 30],
    ['射撃', 'reflex', 3, 30],
    ['運転', 'reflex', 3, 30],
    // 感覚系技能
    ['知覚', 'sensory', 2, 20],
    ['捜索', 'sensory', 2, 20],
    ['追跡', 'sensory', 2, 20],
    // 知力系技能
    ['情報', 'intellectual', 1, 10],
    ['医療', 'intellectual', 1, 10],
    ['動物', 'intellectual', 1, 10],
    // 超常系技能
    ['超常', 'supernatural', 0, 0],
    ['次元', 'supernatural', 0, 0],
    ['時間', 'supernatural', 0, 0],
  ] as const)(
    '%s技能の初期値を%s能力値×10で計算すること（%i×10=%i）',
    (skillName, _, __, expected) => {
      const abilities = {
        physical: 4,
        reflex: 3,
        sensory: 2,
        intellectual: 1,
        supernatural: 0,
      };

      const result = calculateSkillInitialValues(abilities);

      expect(result[skillName]).toBe(expected);
    },
  );
});
