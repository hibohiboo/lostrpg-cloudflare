import { Ability } from './types';

type AbilityInput = {
  name: string;
  group: string;
  type: string;
  recoil: string;
  specialty: string;
  target: string;
  effect: string;
};

/**
 * Abilityオブジェクトを生成するファクトリー関数
 * @param ability - アビリティの基本情報
 * @returns 生成されたAbilityオブジェクト
 */
export const createAbility = (ability: AbilityInput): Ability => ({
  id: `ability-${Date.now()}`,
  name: ability.name,
  group: ability.group,
  type: ability.type,
  recoil: ability.recoil,
  specialty: ability.specialty,
  target: ability.target,
  effect: ability.effect,
});
