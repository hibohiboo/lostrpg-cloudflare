import { MotherlessSkillCatalogEntry } from '@lostrpg/frontend/entities/motherlessSheet';

// クラス列が空、または「汎用」表記のスキルは、習得クラスに関わらず常に候補にする
const isClassless = (skillClass: string) =>
  !skillClass.trim() || skillClass.trim() === '汎用';

export const filterSkillsByClasses = (
  skills: MotherlessSkillCatalogEntry[],
  classNames: string[],
) =>
  skills.filter(
    (skill) => isClassless(skill.class) || classNames.includes(skill.class),
  );
