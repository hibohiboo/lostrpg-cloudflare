import {
  MotherlessEquipment,
  MotherlessEquipmentBase,
  MotherlessItem,
  MotherlessItemBase,
  MotherlessSkill,
  MotherlessSkillBase,
} from '@lostrpg/schemas';

export const createMotherlessSkill = (
  skill: MotherlessSkillBase,
): MotherlessSkill => ({
  id: `skill-${Date.now()}`,
  ...skill,
});

export const createMotherlessItem = (
  item: MotherlessItemBase,
): MotherlessItem => ({
  id: `item-${Date.now()}`,
  number: 1,
  ...item,
});

export const createMotherlessEquipment = (
  equipment: MotherlessEquipmentBase,
): MotherlessEquipment => ({
  id: `equipment-${Date.now()}`,
  ...equipment,
});
