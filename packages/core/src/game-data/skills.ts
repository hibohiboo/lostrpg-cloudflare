export const SKILLS = {
  // 肉体系技能 (physical)
  パワー: { baseAbility: 'physical' as const },
  タフネス: { baseAbility: 'physical' as const },
  スタミナ: { baseAbility: 'physical' as const },
  
  // 反射系技能 (reflex)
  技術: { baseAbility: 'reflex' as const },
  射撃: { baseAbility: 'reflex' as const },
  運転: { baseAbility: 'reflex' as const },
  
  // 感覚系技能 (sensory)
  知覚: { baseAbility: 'sensory' as const },
  捜索: { baseAbility: 'sensory' as const },
  追跡: { baseAbility: 'sensory' as const },
  
  // 知力系技能 (intellectual)
  情報: { baseAbility: 'intellectual' as const },
  医療: { baseAbility: 'intellectual' as const },
  動物: { baseAbility: 'intellectual' as const },
  
  // 超常系技能 (supernatural)
  超常: { baseAbility: 'supernatural' as const },
  次元: { baseAbility: 'supernatural' as const },
  時間: { baseAbility: 'supernatural' as const },
} as const;

export type SkillName = keyof typeof SKILLS;
export type AbilityName = 'physical' | 'reflex' | 'sensory' | 'intellectual' | 'supernatural';