import { useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@lostrpg/frontend/shared/lib/store';
import {
  setBoss,
  setLevel,
  addAbility,
  updateAbility,
  deleteAbility,
} from '../model/bossSlice';
import type { BossAbility } from '@lostrpg/frontend/entities/boss';

export const useEditFormHooks = () => {
  const dispatch = useAppDispatch();
  const boss = useAppSelector((state) => state.boss);

  const [isValidError, setIsValidError] = useState(false);

  const handleLevelChange = (level: number) => {
    dispatch(setLevel(Number.isNaN(level) ? 1 : level));
  };

  const handleAbilityAdd = (ability: BossAbility) => {
    dispatch(addAbility(ability));
  };

  const handleAbilityUpdate = (ability: BossAbility) => {
    dispatch(updateAbility(ability));
    return ability;
  };

  const handleAbilityDelete = (id: string) => {
    dispatch(deleteAbility(id));
  };

  return {
    boss,
    isValidError,
    setIsValidError,
    setBoss: (data: typeof boss) => dispatch(setBoss(data)),
    handleLevelChange,
    handleAbilityAdd,
    handleAbilityUpdate,
    handleAbilityDelete,
  };
};

export type EditFormViewModel = ReturnType<typeof useEditFormHooks>;
