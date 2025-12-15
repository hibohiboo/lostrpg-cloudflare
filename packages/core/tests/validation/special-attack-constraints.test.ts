import { describe, it, expect } from 'vitest';
import { validateSpecialAttackConstraints } from '../../src/validation/special-attack-constraints';

describe('validateSpecialAttackConstraints', () => {
  const validCharacterData = {
    specialAttacks: [
      {
        name: 'パワースラッシュ',
        level: 1,
        maxLevel: 3,
        timing: 'メジャーアクション',
        skill: '白兵攻撃',
        target: '単体',
        range: '武器',
        cost: 8,
        effect: '強力な一撃'
      },
    ],
  };

  describe('正常系', () => {
    it('有効な必殺技構成で成功すること', () => {
      const result = validateSpecialAttackConstraints(validCharacterData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('必殺技がない場合も成功すること', () => {
      const dataWithoutSpecialAttacks = {
        specialAttacks: [],
      };

      const result = validateSpecialAttackConstraints(dataWithoutSpecialAttacks);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('制約チェック', () => {
    it('必殺技のレベルがmaxLevelを超えている場合は失敗すること', () => {
      const invalidData = {
        specialAttacks: [
          {
            name: 'パワースラッシュ',
            level: 5, // maxLevel: 3を超過
            maxLevel: 3,
            timing: 'メジャーアクション',
            skill: '白兵攻撃',
            target: '単体',
            range: '武器',
            cost: 8,
            effect: '強力な一撃'
          },
        ],
      };

      const result = validateSpecialAttackConstraints(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'LEVEL_EXCEEDS_MAX',
        message: '必殺技「パワースラッシュ」のレベル5が最大レベル3を超えています',
        skillName: 'パワースラッシュ',
        level: 5,
        maxLevel: 3,
      });
    });

    it('必殺技のレベルが0以下の場合は失敗すること', () => {
      const invalidData = {
        specialAttacks: [
          {
            name: 'パワースラッシュ',
            level: 0, // レベル0は無効
            maxLevel: 3,
            timing: 'メジャーアクション',
            skill: '白兵攻撃',
            target: '単体',
            range: '武器',
            cost: 8,
            effect: '強力な一撃'
          },
        ],
      };

      const result = validateSpecialAttackConstraints(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: 'INVALID_LEVEL',
        message: '必殺技「パワースラッシュ」のレベルは1以上である必要があります',
        skillName: 'パワースラッシュ',
        level: 0,
      });
    });
  });
});