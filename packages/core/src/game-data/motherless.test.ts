import { describe, expect, it } from 'vitest';
import {
  abilityBonus,
  calcAccuracy,
  calcAttackPower,
  calcBaseHp,
  calcBaseTp,
  calcDefense,
  calcElementPower,
  calcEvasion,
  calcInitiativeModifier,
} from './motherless';

describe('abilityBonus', () => {
  it('6点ごとにボーナス+1、端数は切り捨てること', () => {
    expect(abilityBonus(0)).toBe(0);
    expect(abilityBonus(5)).toBe(0);
    expect(abilityBonus(6)).toBe(1);
    expect(abilityBonus(11)).toBe(1);
    expect(abilityBonus(12)).toBe(2);
    expect(abilityBonus(17)).toBe(2);
    expect(abilityBonus(18)).toBe(3);
  });
});

describe('calcBaseHp', () => {
  it('5 + Lv + 体力ボーナス + ceil(筋力ボーナス/2) で計算されること', () => {
    // 体力ボーナス3, 筋力ボーナス3 -> ceil(3/2)=2
    expect(calcBaseHp(1, 3, 3)).toBe(5 + 1 + 3 + 2);
    // 筋力ボーナスが偶数のとき(切り上げでも変化しないこと)
    expect(calcBaseHp(2, 0, 4)).toBe(5 + 2 + 0 + 2);
  });
});

describe('calcBaseTp', () => {
  it('知能ボーナス + ceil(感覚ボーナス/2) で計算されること', () => {
    expect(calcBaseTp(2, 3)).toBe(2 + 2); // ceil(3/2)=2
    expect(calcBaseTp(0, 0)).toBe(0);
  });
});

describe('装備値とボーナスの合算', () => {
  it('calcAttackPower/calcElementPower/calcAccuracy はボーナスを加算すること', () => {
    expect(calcAttackPower(4, 2)).toBe(6);
    expect(calcElementPower(1, 3)).toBe(4);
    expect(calcAccuracy(0, 2)).toBe(2);
  });

  it('calcEvasion/calcDefense はボーナスを加算しないこと', () => {
    expect(calcEvasion(3)).toBe(3);
    expect(calcDefense(5)).toBe(5);
  });
});

describe('calcInitiativeModifier', () => {
  it('器用ボーナス + ceil(知力ボーナス/2) + 装備の先制補正合計 で計算されること', () => {
    expect(calcInitiativeModifier(2, 3, 1)).toBe(2 + 2 + 1); // ceil(3/2)=2
    expect(calcInitiativeModifier(0, 0, 0)).toBe(0);
  });
});
