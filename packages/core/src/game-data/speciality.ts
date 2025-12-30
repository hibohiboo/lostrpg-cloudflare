export const specialties = [
  '追跡',
  '探索',
  '鑑定',
  '手当',
  '雑学',
  '機械',
  '作る',
  '化学',
  '料理',
  '伝える',
  '歌う',
  '聴く',
  '感覚器',
  '見つける',
  '反応',
  '閃く',
  '脳',
  '考える',
  '予感',
  '叫ぶ',
  '口',
  '噛む',
  '操作',
  '殴る',
  '斬る',
  '利き腕',
  '撃つ',
  '掴む',
  '投げる',
  '逆腕',
  '刺す',
  '振る',
  '締める',
  '塞ぐ',
  '呼吸器',
  '止める',
  '動かない',
  '受ける',
  '心臓',
  '逸らす',
  'かわす',
  '落ちる',
  '消化器',
  '耐える',
  '泳ぐ',
  '走る',
  '蹴る',
  '利き脚',
  '跳ぶ',
  '仕掛ける',
  'しゃがむ',
  '逆脚',
  '滑る',
  '踏む',
  '歩く',
  '地理',
  '休まない',
  '待つ',
  '捕らえる',
  '隠れる',
  '休む',
  'バランス',
  '現れる',
  '追い込む',
  '逃げる',
  '罠',
];
export const bodyParts = [
  '脳',
  '利き腕',
  '利き脚',
  '消化器',
  '感覚器',
  '口',
  '呼吸器',
  '逆脚',
  '逆腕',
  '心臓',
];
export const specialtyRows = specialties.reduce(
  (acc, item, index) => {
    const col = index % 11;

    if (!acc[col]) acc[col] = [];

    acc[col].push({
      name: item,
      isBodyParts: bodyParts.includes(item),
    });
    return acc;
  },
  [] as { name: string; isBodyParts: boolean }[][],
);

export const initiativeSpecialties = [
  '反応',
  '予感',
  '動かない',
  '走る',
  '隠れる',
  '追い込む',
];

export const specialtiesTableGaps = ['A', 'B', 'C', 'D', 'E'];
export const specialtiesTableColumns = [
  '',
  '技術',
  'A',
  '頭部',
  'B',
  '腕部',
  'C',
  '胴部',
  'D',
  '脚部',
  'E',
  '環境',
] as const;

export const damageTableRows = bodyParts.map((bodyPart, index) => ({
  diceNumber: index < 5 ? index + 2 : index + 3,
  name: bodyPart,
}));
