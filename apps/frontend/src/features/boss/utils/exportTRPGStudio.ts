import { saveAs } from 'file-saver';
import { calcBossStamina, calcBossWillPower } from '../model/bossSlice';
import type { BossFormData } from '../model/bossSlice';

// アビリティのカラム
const abilitiesColumns = [
  '名前',
  'グループ',
  'タイプ',
  '特技',
  '対象',
  '反動',
  '効果',
];

// ヌシデータをTRPGスタジオ形式のJSONに変換
export const bossToTRPGStudioDoc = (boss: BossFormData): string => {
  const result = {
    info: {
      chara_name: boss.name,
      age: '',
      sex: '',
      job: `ヌシ Lv${boss.level}`,
      commands: '',
      remarks: '全ての特技を習得しており、ギャップは埋めません。',
    },
    array_forms: [
      {
        type: 'charaSheetInputCloneNumber',
        title: 'ステータス',
        forms: [
          {
            text: 'レベル',
            panel: false,
            number: boss.level,
          },
          {
            text: '体力',
            panel: false,
            number: boss.stamina,
          },
          {
            text: '体力(上限)',
            panel: false,
            number: calcBossStamina(boss.level),
          },
          {
            text: '気力',
            panel: false,
            number: boss.willPower,
          },
          {
            text: '気力(上限)',
            panel: false,
            number: calcBossWillPower(boss.level),
          },
        ],
      },
      {
        type: 'charaSheetInputCloneNote',
        title: '外見',
        forms: [
          {
            textarea: boss.appearance || '',
          },
        ],
      },
      {
        type: 'charaSheetInputCloneTextTable',
        title: 'アビリティ',
        array_th: abilitiesColumns,
        array_tr: boss.abilities.map((a) => [
          a.name,
          a.group,
          a.type,
          a.specialty,
          a.target || '',
          a.recoil,
          a.effect,
        ]),
      },
    ],
  };

  return JSON.stringify(result);
};

// TRPGスタジオ用テキストファイルをダウンロード
export const exportBossToTRPGStudio = (boss: BossFormData): void => {
  const json = bossToTRPGStudioDoc(boss);
  const blob = new Blob([json], { type: 'text/plain' });
  saveAs(blob, `${boss.name}.txt`);
};
