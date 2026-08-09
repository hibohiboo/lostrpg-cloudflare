import { specialties, specialtiesTableColumns } from '@lostrpg/core/game-data/speciality';
import { saveAs } from 'file-saver';
import type { EnemyFormData } from '../model/enemySlice';

// 範囲配列を生成
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

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
  const heads = specialtiesTableColumns.filter((_, i) => i % 2 === 1);
  const makeData = (t: string) => ({
    t,
    c: enemy.specialties.includes(t),
    k: 1,
  });
  const specialityList = range(11).map((y) =>
    range(6).map((x) => makeData(specialties[y + 11 * x])),
  );

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
        type: 'charaSheetInputCloneCheckTable',
        title: '特技',
        array_th: heads.map((t) => ({ t, c: false, k: 1 })),
        array_tr: specialityList,
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
