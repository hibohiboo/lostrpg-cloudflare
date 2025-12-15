/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CharacterFormData } from '@age-of-hero/ui';

interface CharacterDetail {
  id: string;
  name: string;
  selectedClasses?: [string, string];
  abilityBonus?: string;
  skillPointsLimit?: number;
  heroSkillLevelLimit?: number;
  itemPriceLimit?: number;
  skillAllocations?: Record<string, number>;
  heroSkills?: any[];
  specialAttacks?: any[];
  items?: any[];
  status?: {
    hp: number;
    sp: number;
    actionValue: number;
  };
  statusModifiers?: {
    hpModifier: number;
    spModifier: number;
    actionValueModifier: number;
  };
  sessions?: any[];
}

// eslint-disable-next-line complexity
export const transformCharacterToFormData = (
  character: CharacterDetail,
): CharacterFormData => ({
  name: character.name,
  selectedClasses: character.selectedClasses || ['マッスル', 'マッスル'],
  abilityBonus: (character.abilityBonus as any) || 'physical',
  skillPointsLimit: character.skillPointsLimit || 150,
  heroSkillLevelLimit: character.heroSkillLevelLimit || 7,
  itemPriceLimit: character.itemPriceLimit || 20,
  skillAllocations: character.skillAllocations || {},
  heroSkills: character.heroSkills || [],
  specialAttacks: character.specialAttacks || [],
  items: character.items || [],
  status: character.status || {
    hp: 0,
    sp: 0,
    actionValue: 0,
  },
  statusModifiers: character.statusModifiers || {
    hpModifier: 0,
    spModifier: 0,
    actionValueModifier: 0,
  },
  sessions: character.sessions || [],
});
