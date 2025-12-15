import { describe, it, expect } from 'vitest';
import {
  validateCreateCharacter,
  type CreateCharacterRequest,
} from '../../src/validation/character';

describe('validateCreateCharacter', () => {
  // 有効なテストデータ
  const validCharacterData: CreateCharacterRequest = {
    name: '山田太郎',
    selectedClasses: ['マッスル', 'テクノロジー'],
    skillAllocations: {
      パワー: 20,
      タフネス: 30,
    },
    heroSkills: [
      {
        name: 'パワードライブ',
        level: 3,
        maxLevel: 5,
        timing: 'メジャーアクション',
        skill: '白兵攻撃',
        target: '単体',
        range: '武器',
        cost: '4',
        effect: '対象に白兵攻撃を行う。',
      },
    ],
    specialAttacks: [
      {
        name: 'パワースラッシュ',
        level: 1,
        maxLevel: 3,
        timing: 'メジャーアクション',
        skill: '白兵攻撃',
        target: '単体',
        range: '武器',
        cost: '8',
        effect: '強力な一撃',
      },
    ],
    items: [
      {
        name: '射撃武器（小）',
        type: '射撃',
        skill: '〈射撃〉',
        modifier: '＋０％',
        attackPower: '＋５',
        guardValue: '０',
        range: '近',
        price: 6,
        effect: '射撃攻撃用の基本的な武器',
      },
    ],
    sessions: [],
  };

  describe('正常系', () => {
    it('有効なデータで成功すること', () => {
      const result = validateCreateCharacter(validCharacterData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('山田太郎');
        expect(result.data.selectedClasses).toHaveLength(2);
      }
    });

    it('パスワードがnullでも成功すること', () => {
      const dataWithNullPassword = { ...validCharacterData, password: null };
      const result = validateCreateCharacter(dataWithNullPassword);

      expect(result.success).toBe(true);
    });

    it('パスワードが文字列でも成功すること', () => {
      const dataWithPassword = { ...validCharacterData, password: 'secret123' };
      const result = validateCreateCharacter(dataWithPassword);

      expect(result.success).toBe(true);
    });
  });

  describe('寛容なバリデーション', () => {
    describe('name', () => {
      it('nameが空文字でも成功すること（寛容な設計）', () => {
        const validData = { ...validCharacterData, name: '' };
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });

      it('nameが51文字以上の場合は失敗すること', () => {
        const longName = 'あ'.repeat(51);
        const invalidData = { ...validCharacterData, name: longName };
        const result = validateCreateCharacter(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.details).toContainEqual({
            field: 'name',
            message: 'name は50文字以内で入力してください',
          });
        }
      });

      it('nameがundefinedでも成功すること（寛容な設計）', () => {
        const { name, ...validData } = validCharacterData;
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });
    });

    describe('selectedClasses', () => {
      it('selectedClassesが1個でも成功すること（寛容な設計）', () => {
        const validData = {
          ...validCharacterData,
          selectedClasses: ['テクノロジー'],
        };
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });

      it('selectedClassesが3個でも成功すること（寛容な設計）', () => {
        const validData = {
          ...validCharacterData,
          selectedClasses: ['マッスル', 'バイオ', 'アーツ'],
        };
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });
    });

    describe('skillAllocations', () => {
      it('skillAllocationsに負の値が含まれても成功すること（寛容な設計）', () => {
        const validData = {
          ...validCharacterData,
          skillAllocations: {
            パワー: -10,
            タフネス: 30,
          },
        };
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });
    });

    describe('heroSkills', () => {
      it('heroSkillsのlevelが0でも成功すること（寛容な設計）', () => {
        const validData = {
          ...validCharacterData,
          heroSkills: [
            {
              name: 'パワードライブ',
              level: 0,
            },
          ],
        };
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });
    });

    describe('items', () => {
      it('必須フィールドのみのアイテムでも成功すること', () => {
        const validData = {
          ...validCharacterData,
          items: [
            {
              name: '基本アイテム',
              type: 'その他',
              price: 1,
            },
          ],
        };
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });

      it('全フィールドを含むアイテムで成功すること', () => {
        const validData = {
          ...validCharacterData,
          items: [
            {
              name: '完全装備',
              type: '白兵/射撃',
              skill: '〈技術〉/〈射撃〉',
              modifier: '＋５％',
              attackPower: '＋８/＋６',
              guardValue: '３',
              range: '至近/中',
              dodge: '＋０％',
              actionValue: '－１',
              protection: '５',
              price: 10,
              effect: '多機能武器',
              quantity: 2,
            },
          ],
        };
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });

      it('priceが負の値の場合は失敗すること', () => {
        const invalidData = {
          ...validCharacterData,
          items: [
            {
              name: '無効価格アイテム',
              type: 'その他',
              price: -1,
            },
          ],
        };
        const result = validateCreateCharacter(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.details.some((d) => d.field.includes('price')),
          ).toBe(true);
        }
      });

      it('空のアイテム配列でも成功すること', () => {
        const validData = {
          ...validCharacterData,
          items: [],
        };
        const result = validateCreateCharacter(validData);

        expect(result.success).toBe(true);
      });
    });
  });
});
