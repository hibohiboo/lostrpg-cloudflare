import { SKILLS } from '../game-data/skills';

type Abilities = {
  physical: number;
  reflex: number;
  sensory: number;
  intellectual: number;
  supernatural: number;
};

export function calculateSkillInitialValues(abilities: Abilities) {
  return Object.entries(SKILLS).reduce<Record<string, number>>(
    (acc, [skillName, skillData]) => {
      const { baseAbility } = skillData;
      acc[skillName] = abilities[baseAbility] * 10;
      return acc;
    },
    {},
  );
}
