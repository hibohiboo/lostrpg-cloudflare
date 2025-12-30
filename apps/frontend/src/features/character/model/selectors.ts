import {
  dragonPlainItemList,
  items,
  strangeFieldsItemList,
} from '@lostrpg/core/game-data/item';
import { createSelector } from '@reduxjs/toolkit';

export const itemCatalogSelector = createSelector(
  [
    (state: RootState) => state.character.useStrangeField,
    (state: RootState) => state.character.useDragonPlain,
  ],
  (useStrangeField, useDragonPlain) => {
    const ret = [...items];

    if (useStrangeField) ret.push(...strangeFieldsItemList);
    if (useDragonPlain) ret.push(...dragonPlainItemList);

    return ret;
  },
);
