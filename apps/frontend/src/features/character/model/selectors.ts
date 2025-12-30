import {
  dragonPlainItemList,
  items,
  strangeFieldsItemList,
} from '@lostrpg/core/game-data/item';
import { createSelector } from '@reduxjs/toolkit';

const characterState = (state: RootState) => state.character;

export const itemCatalogSelector = createSelector(
  [characterState],
  (character) => {
    const ret = [...items];

    if (character.useStrangeField) ret.push(...strangeFieldsItemList);
    if (character.useDragonPlain) ret.push(...dragonPlainItemList);
    console.log(ret);
    return ret;
  },
);
