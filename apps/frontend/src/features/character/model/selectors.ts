import {
  abilityList,
  strangeFieldsAbilityList,
  dragonPlainAbilityList,
  trophyAbilityList,
} from '@lostrpg/core/game-data/character';
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
export const equipmentCatalogSelector = createSelector(
  [itemCatalogSelector],
  (ret) => ret.filter((i) => i.area !== '-'),
);

export const abilityCatalogSelector = createSelector(
  [
    (state: RootState) => state.character.classes,
    (state: RootState) => state.character.useStrangeField,
    (state: RootState) => state.character.useDragonPlain,
    (state: RootState) => state.character.trophies,
  ],
  (classes, useStrangeField, useDragonPlain, trophies) => {
    const classNames = classes.map((c) => c.name);
    const ret: typeof abilityList = [];

    // 基本アビリティリスト
    abilityList.forEach((group) => {
      // 汎用グループは常に追加
      if (group.id === 'general') {
        ret.push(group);
        return;
      }
      // クラスを取得している場合のみ追加
      if (classNames.includes(group.name)) {
        ret.push(group);
      }
    });

    // サプリメント1のアビリティ
    if (useStrangeField) {
      strangeFieldsAbilityList.forEach((group) => {
        if (group.id === 'general') {
          ret.push(group);
          return;
        }
        if (classNames.includes(group.name)) {
          ret.push(group);
        }
      });
    }

    // ドラゴンプレインのアビリティ
    if (useDragonPlain) {
      dragonPlainAbilityList.forEach((group) => {
        if (classNames.includes(group.name)) {
          ret.push(group);
        }
      });
    }

    // トロフィーアビリティ
    trophyAbilityList.forEach((group) => {
      if (trophies.includes(group.name)) {
        ret.push(group);
      }
    });

    return ret;
  },
);
