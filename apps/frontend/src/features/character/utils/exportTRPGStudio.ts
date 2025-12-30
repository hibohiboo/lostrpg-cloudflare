/* eslint-disable complexity */
import { specialties } from '@lostrpg/core/game-data/speciality';
import { CreateCharacterRequest } from '@lostrpg/schemas';
import { saveAs } from 'file-saver';

// 範囲配列を生成
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

// 特技テーブルのヘッダー
const specialtiesTableColumns = [
  '部位',
  '技術',
  '部位',
  '頭部',
  '部位',
  '腕部',
  '部位',
  '胴部',
  '部位',
  '脚部',
  '部位',
  '環境',
];

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

// 装備のカラム
const equipmentColumns = ['タイプ', '特技', '対象', '特性', '効果'];

// アイテムのカラム
const itemsColumns = [
  '名前',
  '個数',
  '価格',
  '重量',
  'タイプ',
  '部位',
  '特技',
  '対象',
  '特性',
  '効果',
];

// キャラクターデータをTRPGスタジオ形式のJSONに変換
export const characterToTRPGStudioDoc = (
  character: CreateCharacterRequest,
): string => {
  const heads = specialtiesTableColumns.filter((_, i) => i % 2 === 1);
  const makeData = (t: string) => ({
    t,
    c: character.specialties?.includes(t) || false,
    k: 1,
  });

  // 特技リストを11×6のグリッドに配置
  const specialityList = range(11).map((y) =>
    range(6).map((x) => makeData(specialties[y + 11 * x])),
  );

  const result = {
    info: {
      chara_name: character.name,
      age: '',
      sex: '',
      job: character.classes?.map((c) => c.name).join('/') || '',
      commands: '',
      remarks: character.summary || '',
    },
    array_forms: [
      {
        type: 'charaSheetInputCloneNumber',
        title: 'ステータス',
        forms: [
          {
            text: '生命力',
            panel: false,
            number: character.staminaBase || 0,
          },
          {
            text: '体力',
            panel: false,
            number: character.stamina,
          },
          {
            text: '精神力',
            panel: false,
            number: character.willPowerBase || 0,
          },
          {
            text: '気力',
            panel: false,
            number: character.willPower,
          },
          {
            text: '所持限界',
            panel: false,
            number: character.carryingCapacity || 0,
          },
        ],
      },
      {
        type: 'charaSheetInputCloneNote',
        title: '容姿',
        forms: [
          {
            textarea: character.appearance || '',
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
        array_tr: (character.abilities || []).map((a) => [
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
        title: '装備',
        array_th: ['名前', ...equipmentColumns],
        array_tr: (character.equipments || []).map((e) => [
          e.name,
          e.type,
          e.specialty,
          e.target || '',
          e.trait,
          e.effect,
        ]),
      },
      {
        type: 'charaSheetInputCloneTextTable',
        title: 'アイテム',
        array_th: itemsColumns,
        array_tr: (character.items || []).map((a) => [
          a.name,
          a.number || 1,
          a.j,
          a.weight,
          a.type,
          a.area || '',
          a.specialty,
          a.target || '',
          a.trait || '',
          a.effect,
        ]),
      },
    ],
  };

  // 袋を追加
  character.bags?.forEach((bag) => {
    result.array_forms.push({
      type: 'charaSheetInputCloneTextTable',
      title: bag.name,
      array_th: itemsColumns,
      array_tr: (bag.items || []).map((a) => [
        a.name,
        a.number || 1,
        a.j,
        a.weight,
        a.type,
        a.area || '',
        a.specialty,
        a.target || '',
        a.trait || '',
        a.effect,
      ]),
    });
  });

  // 詳細欄を追加
  result.array_forms.push({
    type: 'charaSheetInputCloneNote',
    title: '詳細',
    forms: [
      {
        textarea: character.freeWriting || '',
      },
    ],
  });

  return JSON.stringify(result);
};

// TRPGスタジオ用テキストファイルをダウンロード
export const exportCharacterToTRPGStudio = (
  character: CreateCharacterRequest,
): void => {
  const json = characterToTRPGStudioDoc(character);
  const blob = new Blob([json], { type: 'text/plain' });
  saveAs(blob, `${character.name}.txt`);
};
