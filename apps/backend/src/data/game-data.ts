// ゲームデータの静的定義
export const GAME_DATA = {
  classes: [
    {
      id: 'class-muscle',
      name: 'マッスル',
      physicalBase: 3,
      reflexBase: 2,
      sensoryBase: 2,
      intellectualBase: 1,
      supernaturalBase: 0,
      hpBase: 38,
      spBase: 17,
      description: '肉体派のクラス。力強い攻撃と高い耐久力を持つ。'
    }
  ],
  skills: [
    {
      id: 'skill-power',
      name: 'パワー',
      category: 'physical',
      description: '素手や武器による力任せな攻撃、災害救助など。',
      order: 1
    }
  ],
  heroSkills: [
    {
      id: 'hero-power-drive',
      name: 'パワードライブ',
      maxLevel: 7,
      timing: 'メジャーアクション',
      skill: 'パワー',
      target: '単体',
      range: '近接',
      cost: 3,
      effect: 'パワー+レベルで攻撃。成功時追加ダメージ。',
      classRestriction: null
    }
  ],
  items: [
    {
      id: 'item-small-gun',
      name: '射撃武器（小）',
      type: '射撃武器',
      skill: '〈射撃〉',
      modifier: '+20%',
      attackPower: '+4',
      guardValue: '2',
      range: '近距離',
      price: 60,
      effect: '拳銃など。'
    }
  ]
} as const;