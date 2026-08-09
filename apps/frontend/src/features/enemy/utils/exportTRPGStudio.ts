import { saveAs } from 'file-saver';
import type { EnemyFormData } from '../model/enemySlice';

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

// エネミーデータをTRPGスタジオ形式のJSONに変換
export const enemyToTRPGStudioDoc = (enemy: EnemyFormData): string => {
  const typeLabel = enemy.type ? `（${enemy.type}）` : '';
  const result = {
    info: {
      chara_name: enemy.name,
      age: '',
      sex: '',
      job: `エネミー Lv${enemy.level}${typeLabel}`,
      commands: '',
      remarks: '部位ダメージを受けず、体力が0になると倒れます。',
    },
    array_forms: [
      {
        type: 'charaSheetInputCloneNumber',
        title: 'ステータス',
        forms: [
          {
            text: 'レベル',
            panel: false,
            number: enemy.level,
          },
          {
            text: '体力',
            panel: false,
            number: enemy.stamina,
          },
          {
            text: '気力',
            panel: false,
            number: enemy.willPower,
          },
        ],
      },
      {
        type: 'charaSheetInputCloneNote',
        title: '外見',
        forms: [
          {
            textarea: enemy.appearance || '',
          },
        ],
      },
      {
        type: 'charaSheetInputCloneTextTable',
        title: 'アビリティ',
        array_th: abilitiesColumns,
        array_tr: enemy.abilities.map((a) => [
          a.name,
          a.group,
          a.type,
          a.specialty,
          a.target || '',
          a.recoil,
          a.effect,
        ]),
      },
      {
        type: 'charaSheetInputCloneTextTable',
        title: 'ドロップアイテム表（1d6）',
        array_th: ['出目', 'アイテム'],
        array_tr: enemy.dropItems.map((item, index) => [
          String(index + 1),
          item,
        ]),
      },
    ],
  };

  return JSON.stringify(result);
};

// TRPGスタジオ用テキストファイルをダウンロード
export const exportEnemyToTRPGStudio = (enemy: EnemyFormData): void => {
  const json = enemyToTRPGStudioDoc(enemy);
  const blob = new Blob([json], { type: 'text/plain' });
  saveAs(blob, `${enemy.name}.txt`);
};
