export {
  bossSlice,
  setBoss,
  updateBoss,
  setLevel,
  addAbility,
  updateAbility,
  deleteAbility,
  resetBoss,
  calcBossStamina,
  calcBossWillPower,
} from './model/bossSlice';
export type { BossFormData } from './model/bossSlice';
export { default as bossReducer } from './model/bossSlice';

export * from './hooks/useEditFormHooks';
export { default as BossEditForm } from './ui/EditForm';
export { SpecialtiesSection } from './ui/sections';
