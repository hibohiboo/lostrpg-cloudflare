import { CLASSES, type ClassName } from '../game-data/classes';

type AbilityName =
  | 'physical'
  | 'reflex'
  | 'sensory'
  | 'intellectual'
  | 'supernatural';

export function calculateAbilities(
  classes: [string, string],
  bonusAbility?: string,
) {
  const [class1, class2] = classes as [ClassName, ClassName];
  const stats1 = CLASSES[class1];
  const stats2 = CLASSES[class2];

  const baseAbilities = {
    physical: stats1.physical + stats2.physical,
    reflex: stats1.reflex + stats2.reflex,
    sensory: stats1.sensory + stats2.sensory,
    intellectual: stats1.intellectual + stats2.intellectual,
    supernatural: stats1.supernatural + stats2.supernatural,
  };

  // +1ボーナス適用
  if (bonusAbility) {
    baseAbilities[bonusAbility as AbilityName] += 1;
  }

  // HP/SP/行動値計算
  const hp = stats1.hp + stats2.hp;
  const sp = stats1.sp + stats2.sp;
  const actionValue = baseAbilities.reflex * 2 + baseAbilities.intellectual;

  return {
    ...baseAbilities,
    hp,
    sp,
    actionValue,
  };
}
