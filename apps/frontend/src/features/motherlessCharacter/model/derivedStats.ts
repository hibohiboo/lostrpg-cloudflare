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
} from '@lostrpg/core/game-data/motherless';
import {
  MotherlessAbilityScores,
  MotherlessEquipment,
} from '@lostrpg/schemas';

export const sumEquippedStat = (
  equipments: MotherlessEquipment[],
  key: keyof Pick<
    MotherlessEquipment,
    | 'physicalDamage'
    | 'elementDamage'
    | 'accuracy'
    | 'defense'
    | 'evasion'
    | 'initiativeAdjustment'
  >,
) => equipments.reduce((sum, equipment) => sum + (equipment[key] || 0), 0);

export const calcMotherlessDerivedStats = (
  level: number,
  abilities: MotherlessAbilityScores,
  equipments: MotherlessEquipment[],
) => {
  const strengthBonus = abilityBonus(abilities.strength);
  const senseBonus = abilityBonus(abilities.sense);
  const dexterityBonus = abilityBonus(abilities.dexterity);
  const constitutionBonus = abilityBonus(abilities.constitution);
  const intelligenceBonus = abilityBonus(abilities.intelligence);

  return {
    bonuses: {
      strength: strengthBonus,
      sense: senseBonus,
      dexterity: dexterityBonus,
      constitution: constitutionBonus,
      intelligence: intelligenceBonus,
    },
    baseHp: calcBaseHp(level, constitutionBonus, strengthBonus),
    baseTp: calcBaseTp(intelligenceBonus, senseBonus),
    attackPower: calcAttackPower(
      sumEquippedStat(equipments, 'physicalDamage'),
      strengthBonus,
    ),
    elementPower: calcElementPower(
      sumEquippedStat(equipments, 'elementDamage'),
      senseBonus,
    ),
    accuracy: calcAccuracy(
      sumEquippedStat(equipments, 'accuracy'),
      dexterityBonus,
    ),
    evasion: calcEvasion(sumEquippedStat(equipments, 'evasion')),
    defense: calcDefense(sumEquippedStat(equipments, 'defense')),
    initiativeModifier: calcInitiativeModifier(
      dexterityBonus,
      intelligenceBonus,
      sumEquippedStat(equipments, 'initiativeAdjustment'),
    ),
  };
};
