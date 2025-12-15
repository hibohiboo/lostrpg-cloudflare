import { FaEye } from 'react-icons/fa';
import { FaRegHandshake } from 'react-icons/fa6';
import {
  GiRobotAntennas,
  GiCrystalBall,
  GiBrain,
  GiDna2,
  GiStarFormation,
  GiAncientSword,
  GiPunchingBag,
  GiBiceps,
  GiBookshelf,
  GiMagicSwirl,
  GiMuscleUp,
  GiFist,
  GiShield,
  GiHeartPlus,
  GiSteeringWheel,
  GiCrosshair,
  GiWalk,
  GiTinker,
  GiMusicalNotes,
  GiMagnifyingGlass,
  GiSpeaker,
  GiMedicalPack,
  GiSpellBook,
  GiThirdEye,
  GiKnifeThrust,
  GiAbstract061,
  GiModernCity,
  GiFireSilhouette,
  GiAlliedStar,
  GiBoxingGlove,
  GiButterflyKnife,
  GiChestArmor,
  GiClothes,
  GiCoffeeCup,
  GiGladius,
  GiHealthPotion,
  GiMechanicalArm,
  GiMedicines,
  GiPerson,
  GiRelicBlade,
  GiRifle,
  GiShop,
  GiDeathSkull,
  GiGooExplosion,
  GiShieldBash,
  GiStarStruck,
  GiSwordsPower,
  GiTicket,
  GiUpgrade,
} from 'react-icons/gi';
import { MdOutlineBolt, MdOutlinePsychology } from 'react-icons/md';
import { ItemDetails } from '../components/ItemCard';
import { SkillDetails } from '../components/SkillCard';
import type { IconType } from 'react-icons';

export interface ClassData {
  name: string;
  icon: IconType;
  color: string;
  path: string;
}

export interface AbilityData {
  key: 'physical' | 'reflex' | 'sensory' | 'intellectual' | 'supernatural';
  label: string;
  icon: IconType;
  color: string;
}

export interface SkillData {
  name: string;
  icon: IconType;
  category: 'physical' | 'reflex' | 'sensory' | 'intellectual' | 'supernatural';
  color: string;
  description: string;
}

export interface CommonSkillData {
  name: string;
  icon: IconType;
  description: string;
}

export const CLASSES: ClassData[] = [
  {
    name: 'マッスル',
    icon: GiMuscleUp,
    color: 'text-red-600',
    path: 'character/muscle',
  },
  {
    name: 'テクノロジー',
    icon: GiRobotAntennas,
    color: 'text-blue-600',
    path: 'character/technology',
  },
  {
    name: 'マジカル',
    icon: GiCrystalBall,
    color: 'text-purple-600',
    path: 'character/magical',
  },
  {
    name: 'サイキック',
    icon: GiBrain,
    color: 'text-pink-600',
    path: 'character/psychic',
  },
  {
    name: 'バイオ',
    icon: GiDna2,
    color: 'text-green-600',
    path: 'character/bio',
  },
  {
    name: 'エスペラント',
    icon: GiStarFormation,
    color: 'text-yellow-600',
    path: 'character/esperanto',
  },
  {
    name: 'アーティファクト',
    icon: GiAncientSword,
    color: 'text-orange-600',
    path: 'character/artifact',
  },
  {
    name: 'アーツ',
    icon: GiPunchingBag,
    color: 'text-teal-600',
    path: 'character/arts',
  },
] as const;

export const ABILITIES: AbilityData[] = [
  {
    key: 'physical',
    label: '肉体',
    icon: GiBiceps,
    color: 'text-red-600',
  },
  {
    key: 'reflex',
    label: '反射',
    icon: MdOutlineBolt,
    color: 'text-blue-600',
  },
  {
    key: 'sensory',
    label: '感覚',
    icon: GiAlliedStar,
    color: 'text-green-600',
  },
  {
    key: 'intellectual',
    label: '知力',
    icon: GiBookshelf,
    color: 'text-purple-600',
  },
  {
    key: 'supernatural',
    label: '超常',
    icon: GiMagicSwirl,
    color: 'text-indigo-600',
  },
] as const;

export const SKILLS: SkillData[] = [
  {
    name: 'パワー',
    icon: GiFist,
    category: 'physical',
    color: 'text-red-600',
    description:
      '主に素手で攻撃や武器による力任せな攻撃に用いる技能。物をどかすなど災害救助にも役立つ。',
  },
  {
    name: 'タフネス',
    icon: GiShield,
    category: 'physical',
    color: 'text-red-600',
    description:
      '身体がどれだけダメージに耐えられるかを表す技能。防御などに用い、誰かを守るために必要だ。',
  },
  {
    name: 'スタミナ',
    icon: GiHeartPlus,
    category: 'physical',
    color: 'text-red-600',
    description:
      '身体の持久力や回復力を表す技能。長丁場や連続する任務で重要となる。',
  },
  {
    name: '技術',
    icon: GiKnifeThrust,
    category: 'reflex',
    color: 'text-blue-600',
    description:
      '主に武器や道具を上手く扱うために用いる技能。鍛錬次第で様々なことに役立つ。',
  },
  {
    name: '運動',
    icon: GiWalk,
    category: 'reflex',
    color: 'text-blue-600',
    description:
      '反射的な回避や素早い運動に用いる技能。ヴィランから人質を素早く取り戻すのにも役に立つ。',
  },
  {
    name: '操縦',
    icon: GiSteeringWheel,
    category: 'reflex',
    color: 'text-blue-600',
    description:
      '車や船、飛行機などの乗り物を乗りこなすための技能。車などでいち早く現場に駆けつけることもできる。',
  },
  {
    name: '射撃',
    icon: GiCrosshair,
    category: 'sensory',
    color: 'text-green-600',
    description: '銃や弓を用いて射撃を行う技能。長距離狙撃からガンカタまで。',
  },
  {
    name: '知覚',
    icon: FaEye,
    category: 'sensory',
    color: 'text-green-600',
    description:
      '様々なことに気づきやすくなる技能。ヴィランの奇襲から周囲を守ることもできる。',
  },
  {
    name: '製作',
    icon: GiTinker,
    category: 'sensory',
    color: 'text-green-600',
    description:
      '武器や道具、乗り物を作るのに用いる技能。自分の持物にギミックを仕込み事前の準備をする。',
  },
  {
    name: '芸術',
    icon: GiMusicalNotes,
    category: 'sensory',
    color: 'text-green-600',
    description:
      'センスを用いて歌や絵画などを作る技能。センス次第で人々の荒れた心を癒すことも可能だ。',
  },
  {
    name: '情報',
    icon: GiMagnifyingGlass,
    category: 'intellectual',
    color: 'text-purple-600',
    description:
      '自分の力で情報を集める技能。逆に情報戦を仕掛けヴィランをかく乱することもできる。',
  },
  {
    name: '交渉',
    icon: GiSpeaker,
    category: 'intellectual',
    color: 'text-purple-600',
    description:
      '他人と交渉するために用いる技能。物品や情報を調達する際にも役立つ。',
  },
  {
    name: '心理',
    icon: MdOutlinePsychology,
    category: 'intellectual',
    color: 'text-purple-600',
    description:
      '相手の心情を読み取るのに用いる技能。相手の行動を先読みすることもできる。',
  },
  {
    name: '医療',
    icon: GiMedicalPack,
    category: 'intellectual',
    color: 'text-purple-600',
    description:
      'ケガや病に対処するのに用いる技能。傷病者の命を救うのに必要だ。',
  },
  {
    name: '魔術',
    icon: GiSpellBook,
    category: 'supernatural',
    color: 'text-indigo-600',
    description: '魔術を用いる技能。魔術の種類は多岐にわたる。',
  },
  {
    name: '超能力',
    icon: GiThirdEye,
    category: 'supernatural',
    color: 'text-indigo-600',
    description: 'ESPやサイコキネシスなどの超能力を用いる技能。',
  },
  {
    name: '第六感',
    icon: GiAbstract061,
    category: 'supernatural',
    color: 'text-indigo-600',
    description: '五感以外の感覚でものをとらえる技能。時に周囲の助けとなる。',
  },
] as const;

export const COMMON_SKILLS: CommonSkillData[] = [
  {
    name: '〈社会〉',
    icon: GiModernCity,
    description:
      'どのような社会や組織に所属しているかを表す技能。代表的なものはヒーロー協会、企業、警察、裏社会などだ。取得時には〈社会：ヒーロー協会〉といった形で記載し、それぞれ別技能として扱う。',
  },
  {
    name: '〈コネ〉',
    icon: FaRegHandshake,
    description: 'どのような人物とコネクションを持っているかを表す技能。',
  },
  {
    name: '〈意志〉',
    icon: GiFireSilhouette,
    description: '心の強さを表す技能。ヒーローに必須の力だ。',
  },
] as const;

export const ABILITY_CATEGORIES = [
  {
    category: 'physical' as const,
    label: '肉体',
    icon: GiBiceps,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: '肉体的な力やその身体が持つ耐久力を表す能力値だ。',
  },
  {
    category: 'reflex' as const,
    label: '反射',
    icon: MdOutlineBolt,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: '手先の器用さや反射神経の良さを表す能力値だ。',
  },
  {
    category: 'sensory' as const,
    label: '感覚',
    icon: GiAlliedStar,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: '天性のセンスや感受性の高さなどを表す能力値だ。',
  },
  {
    category: 'intellectual' as const,
    label: '知力',
    icon: GiBookshelf,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: '知識や頭脳をどれだけ上手く運用できるかを表す能力値だ。',
  },
  {
    category: 'supernatural' as const,
    label: '超常',
    icon: GiMagicSwirl,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: '通常では考えられないような超常的な力を表す能力値だ。',
  },
] as const;

export const weapons = [
  {
    name: '素手',
    icon: GiFist,
    details: {
      type: '白兵',
      skill: '〈パワー〉',
      modifier: '０％',
      attackPower: '０',
      guardValue: '０',
      range: '至近',
      price: 0,
      effect:
        '武器が何も装備されていない場合、この武器が装備されているものとして扱う。',
    } as ItemDetails,
  },
  {
    name: '格闘武器',
    icon: GiBoxingGlove,
    details: {
      type: '白兵',
      skill: '〈パワー〉',
      modifier: '＋０％',
      attackPower: '＋４',
      guardValue: '３',
      range: '至近',
      price: 4,
    } as ItemDetails,
  },
  {
    name: '片手白兵武器Ａ',
    icon: GiButterflyKnife,
    details: {
      type: '白兵',
      skill: '〈技術〉',
      modifier: '＋５％',
      attackPower: '＋５',
      guardValue: '３',
      range: '至近',
      price: 5,
    } as ItemDetails,
  },
  {
    name: '片手白兵武器Ｂ',
    icon: GiGladius,
    details: {
      type: '白兵',
      skill: '〈技術〉',
      modifier: '＋０％',
      attackPower: '＋８',
      guardValue: '０',
      range: '至近',
      price: 7,
    } as ItemDetails,
  },
  {
    name: '片手白兵武器Ｃ',
    icon: GiButterflyKnife,
    details: {
      type: '白兵',
      skill: '〈技術〉',
      modifier: '＋１０％',
      attackPower: '＋２',
      guardValue: '２',
      range: '至近',
      price: 5,
    } as ItemDetails,
  },
  {
    name: '片手白兵武器Ｄ',
    icon: GiGladius,
    details: {
      type: '白兵',
      skill: '〈技術〉',
      modifier: '－５％',
      attackPower: '＋５',
      guardValue: '０',
      range: '近',
      price: 6,
    } as ItemDetails,
  },
  {
    name: '両手白兵武器Ａ',
    icon: GiRelicBlade,
    details: {
      type: '白兵',
      skill: '〈技術〉',
      modifier: '－１０％',
      attackPower: '＋７',
      guardValue: '３',
      range: '至近',
      price: 7,
      effect: '両手持ち。',
    } as ItemDetails,
  },
  {
    name: '両手白兵武器Ｂ',
    icon: GiRelicBlade,
    details: {
      type: '白兵',
      skill: '〈技術〉',
      modifier: '－１５％',
      attackPower: '＋９',
      guardValue: '４',
      range: '至近',
      price: 8,
      effect: '両手持ち。',
    } as ItemDetails,
  },
  {
    name: '両手白兵武器Ｃ',
    icon: GiRelicBlade,
    details: {
      type: '白兵',
      skill: '〈技術〉',
      modifier: '－１０％',
      attackPower: '＋５',
      guardValue: '４',
      range: '近',
      price: 8,
      effect: '両手持ち。',
    } as ItemDetails,
  },
  {
    name: '射撃武器Ａ',
    icon: GiRifle,
    details: {
      type: '射撃',
      skill: '〈射撃〉',
      modifier: '＋０％',
      attackPower: '＋５',
      guardValue: '０',
      range: '近',
      price: 6,
    } as ItemDetails,
  },
  {
    name: '射撃武器Ｂ',
    icon: GiRifle,
    details: {
      type: '射撃',
      skill: '〈射撃〉',
      modifier: '＋０％',
      attackPower: '＋７',
      guardValue: '０',
      range: '中',
      price: 9,
      effect: '至近距離不可。',
    } as ItemDetails,
  },
  {
    name: '射撃武器Ｃ',
    icon: GiRifle,
    details: {
      type: '射撃',
      skill: '〈射撃〉',
      modifier: '＋５％',
      attackPower: '＋６',
      guardValue: '０',
      range: '近',
      price: 8,
      effect: '至近距離不可。',
    } as ItemDetails,
  },
  {
    name: '射撃武器Ｄ',
    icon: GiRifle,
    details: {
      type: '射撃',
      skill: '〈射撃〉',
      modifier: '＋１０％',
      attackPower: '＋１０',
      guardValue: '０',
      range: '遠',
      price: 12,
      effect: '至近距離不可。両手持ち。',
    } as ItemDetails,
  },
  {
    name: '射撃武器Ｅ',
    icon: GiRifle,
    details: {
      type: '射撃',
      skill: '〈射撃〉',
      modifier: '＋０％',
      attackPower: '＋５',
      guardValue: '０',
      range: '近',
      price: 6,
      effect: 'この武器での攻撃の対象は範囲になる。シーンに１回使用可能。',
    } as ItemDetails,
  },
  {
    name: 'シールドＡ',
    icon: GiShield,
    details: {
      type: '白兵',
      skill: '〈パワー〉',
      modifier: '＋０％',
      attackPower: '＋２',
      guardValue: '４',
      range: '至近',
      price: 5,
    } as ItemDetails,
  },
  {
    name: 'シールドＢ',
    icon: GiShield,
    details: {
      type: '白兵',
      skill: '〈パワー〉',
      modifier: '－１０％',
      attackPower: '＋２',
      guardValue: '６',
      range: '至近',
      price: 7,
    } as ItemDetails,
  },
  {
    name: 'シールドＣ',
    icon: GiShield,
    details: {
      type: '白兵',
      skill: '〈パワー〉',
      modifier: '－２０％',
      attackPower: '＋２',
      guardValue: '８',
      range: '至近',
      price: 10,
      effect: '両手持ち。',
    } as ItemDetails,
  },
];

export const armor = [
  {
    name: 'コスチュームＡ',
    icon: GiClothes,
    details: {
      type: '防具',
      dodge: '＋０％',
      actionValue: '＋０',
      protection: '５',
      price: 5,
    } as ItemDetails,
  },
  {
    name: 'コスチュームＢ',
    icon: GiClothes,
    details: {
      type: '防具',
      dodge: '＋５％',
      actionValue: '＋０',
      protection: '３',
      price: 5,
    } as ItemDetails,
  },
  {
    name: 'コスチュームＣ',
    icon: GiClothes,
    details: {
      type: '防具',
      dodge: '－５％',
      actionValue: '－２',
      protection: '８',
      price: 5,
    } as ItemDetails,
  },
  {
    name: 'アーマー',
    icon: GiChestArmor,
    details: {
      type: '防具',
      dodge: '－１０％',
      actionValue: '－４',
      protection: '１０',
      price: 7,
    } as ItemDetails,
  },
  {
    name: 'サイコスーツ',
    icon: GiChestArmor,
    details: {
      type: '防具',
      dodge: '－１０％',
      actionValue: '－１',
      protection: '２',
      price: 10,
      effect: '装備中、【超常】に属する技能での判定の判定値に＋５％する。',
    } as ItemDetails,
  },
];

export const consumables = [
  {
    name: 'ソーマ',
    icon: GiHealthPotion,
    details: {
      type: '消耗品',
      price: 4,
      effect:
        'マイナーアクション、メジャーアクションで使用可能。ＨＰを２Ｄ点回復する。',
    } as ItemDetails,
  },
  {
    name: 'スキルサプライ',
    icon: GiMedicines,
    details: {
      type: '消耗品',
      price: 6,
      effect:
        'マイナーアクション、メジャーアクションで使用可能。ＳＰを２Ｄ点回復する。',
    } as ItemDetails,
  },
  {
    name: '嗜好品',
    icon: GiCoffeeCup,
    details: {
      type: '消耗品',
      price: 2,
      effect:
        'マイナーアクション、メジャーアクションで使用可能。ＳＰを５点回復する。',
    } as ItemDetails,
  },
];

export const otherItems = [
  {
    name: 'お気に入りの店',
    icon: GiShop,
    details: {
      type: 'その他',
      price: 8,
      effect:
        'ミドルパートでのみ使用可能。シーンの舞台を変更し、そのシーンの終了時に登場していたＰＣ全員はＨＰかＭＰを１Ｄ点回復する。ＧＭは状況に応じてこのアイテムの使用を拒否してもよいが、その場合このアイテムの使用回数には数えない。１シナリオで３回まで使用可能。',
    } as ItemDetails,
  },
  {
    name: 'コネクション：ヒーロー協会',
    icon: FaRegHandshake,
    details: {
      type: 'その他',
      price: 2,
      effect:
        'ミドルパートの情報収集で使用可能。〈社会：ヒーロー協会〉を使用した判定の判定値に＋１０％する。',
    } as ItemDetails,
  },
  {
    name: 'コネクション：企業',
    icon: FaRegHandshake,
    details: {
      type: 'その他',
      price: 2,
      effect:
        'ミドルパートの情報収集で使用可能。〈社会：企業〉を使用した判定の判定値に＋１０％する。',
    } as ItemDetails,
  },
  {
    name: 'コネクション：警察機構',
    icon: FaRegHandshake,
    details: {
      type: 'その他',
      price: 2,
      effect:
        'ミドルパートの情報収集で使用可能。〈社会：警察〉を使用した判定の判定値に＋１０％する。',
    } as ItemDetails,
  },
  {
    name: 'コネクション：情報屋',
    icon: FaRegHandshake,
    details: {
      type: 'その他',
      price: 2,
      effect:
        'ミドルパートの情報収集で使用可能。〈社会：裏社会〉を使用した判定の判定値に＋１０％する。',
    } as ItemDetails,
  },
  {
    name: 'コネクション：学校関係者',
    icon: FaRegHandshake,
    details: {
      type: 'その他',
      price: 2,
      effect:
        'ミドルパートの情報収集で使用可能。〈社会：スクール〉を使用した判定の判定値に＋１０％する。',
    } as ItemDetails,
  },
  {
    name: 'バディ',
    icon: GiPerson,
    details: {
      type: 'その他',
      price: 2,
      effect:
        'ミドルパートの情報収集で使用可能。〈社会：○○〉を使用した判定の判定値に＋１０％する。１シナリオに１回使用可能。',
    } as ItemDetails,
  },
];

export const technologyItems = [
  {
    name: 'パワードスーツ',
    icon: GiMechanicalArm,
    details: {
      type: '防具',
      dodge: '＋０％',
      actionValue: '＋０',
      protection: '１０',
      price: 0,
      effect:
        '装備中、素手のダメージを＋５し、〈パワー〉判定を〈操縦〉で代用してもよい。',
    } as ItemDetails,
  },
  {
    name: 'ガンソード',
    icon: GiMechanicalArm,
    details: {
      type: '白兵/射撃',
      skill: '〈白兵〉/〈射撃〉',
      modifier: '－１０％',
      attackPower: '＋１０/＋７',
      guardValue: '５',
      range: '至近/中',
      price: 0,
      effect:
        '白兵攻撃を行う際は左側のデータを、射撃攻撃を行う際は右側のデータを使用する。射撃攻撃は至近距離不可。',
    } as ItemDetails,
  },
  {
    name: '四連装スプリットミサイル',
    icon: GiMechanicalArm,
    details: {
      type: '射撃',
      skill: '〈射撃〉',
      modifier: '＋０％',
      attackPower: '＋１２',
      guardValue: '０',
      range: '遠距離',
      price: 0,
      effect:
        '至近距離、近距離への使用不可。この武器での攻撃の対象は範囲になり、ダメージ算出時防護点を無視する。シーンに１回使用可能。',
    } as ItemDetails,
  },
  {
    name: '加速装置',
    icon: GiMechanicalArm,
    details: {
      type: '消耗品',
      price: 0,
      effect:
        'スタートプロセスに使用し、そのラウンド中の行動値＋１０。シーンに１回使用可能。',
    } as ItemDetails,
  },
  {
    name: 'サポートＡＩ',
    icon: GiMechanicalArm,
    details: {
      type: 'その他',
      price: 0,
      effect:
        '自分が何らかの判定を行った直後に使用する。その判定を振り直す。シナリオに３回使用可能。',
    } as ItemDetails,
  },
  {
    name: 'ロケットブースター',
    icon: GiMechanicalArm,
    details: {
      type: 'その他',
      price: 0,
      effect:
        'ムーブアクションに使用し、二段回移動を行う。この移動では移動妨害されない。',
    } as ItemDetails,
  },
];

export const magicalSkills = [
  {
    name: '《マジカルアタック》',
    icon: GiSpellBook,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '〈魔術〉',
      target: '単体',
      range: '中距離',
      cost: '5',
      effect:
        '対象に特殊攻撃を行う。コンボ2。このヒーロースキルを組み合わせた攻撃のダメージに[ＬＶ×２]する。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《ウィッチブルーム》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 5,
      timing: 'スタートプロセス',
      skill: 'なし',
      target: '単体',
      range: '至近',
      cost: '5',
      effect:
        '対象はそのラウンド中、ドッジの判定に[Ｌｖ×１０]％し、移動を妨害されずエンゲージの封鎖の影響を受けない。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《スマイルマジック》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 5,
      timing: 'マイナー',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '3',
      effect:
        'あなたはこのメインプロセスで行う〈交渉〉か〈コネ〉の判定に＋[（Ｌｖ×10）＋10]％する。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《ハピネス》',
    icon: GiHeartPlus,
    details: {
      maxLv: 3,
      timing: 'オート',
      skill: 'なし',
      target: '単体',
      range: '中距離',
      cost: '4',
      effect:
        '対象が何らかの判定を行う直前に使用する。対象が行う判定の判定値に＋[Ｌｖ×２０]％する。１ラウンドに１回使用可能。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《支援魔術》',
    icon: GiSpellBook,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '〈魔術〉',
      target: '単体',
      range: '中距離',
      cost: '5',
      effect:
        '対象が次に行う攻撃の判定値に＋２０％、ダメージに＋[Ｌｖ×４]＋１Ｄする。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《ヒーリングライト》',
    icon: GiHeartPlus,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '〈魔術〉',
      target: '単体',
      range: '中距離',
      cost: '4',
      effect: '対象のＨＰを[Ｌｖ×５]＋３Ｄ回復する。コンボ２。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《マルチスペル》',
    icon: GiSpellBook,
    details: {
      maxLv: 3,
      timing: 'メジャー',
      skill: '〈魔術〉',
      target: '効果参照',
      range: 'なし',
      cost: '10',
      effect:
        'このヒーロースキルを組み合わせた行動の対象を[１＋Ｌｖ÷２(切り上げ)]体に変更する。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《マジカルチェンジ》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 3,
      timing: 'スタートプロセス',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '12',
      effect:
        'あなたの能力値をふたつ選択する。そのラウンド中、選択した能力値の一方を＋１し、もう一方を－１する。シーンにＬｖ回使用可能。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《封印結界術式》',
    icon: GiSpellBook,
    details: {
      maxLv: 1,
      timing: 'オート',
      skill: 'なし',
      target: '単体',
      range: '中距離',
      cost: '12',
      effect:
        '対象が何らかのスキルを使用した際に使用する。対象が使用したスキルひとつを選択し、その効果を無効化する。シナリオに１回使用可能。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: '《奇跡の魔法》',
    icon: GiTicket,
    details: {
      maxLv: 1,
      timing: 'オート',
      skill: 'なし',
      target: '単体',
      range: '中距離',
      cost: 'ＦＣ',
      effect:
        '対象が何らかの判定を行った直後に使用する。ファンチットを任意の枚数消費する。その判定の出目を＋[消費したＦＣ×１０]か－[消費ＦＣ×１０]する。シナリオに１回使用可能。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
];

export const psychicSkills = [
  {
    name: '《パワーオリジン》',
    icon: GiBrain,
    details: {
      maxLv: 1,
      timing: '常時',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'なし',
      effect:
        'あなたは、《オリジン：○○》という名前のヒーロースキルを一種類選択し、取得することが可能になる。このヒーロースキルの効果で選択しなかった《オリジン：○○》は取得することができない。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《オリジン：エレメント》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 3,
      timing: 'メジャーアクション',
      skill: '〈超能力〉',
      target: '単体',
      range: '中距離',
      cost: '4',
      effect:
        '対象に特殊攻撃を行う。コンボ２。このヒーロースキルを組み合わせた攻撃のダメージに＋[（Ｌｖ×２）＋３]',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《オリジン：精神感応能力》',
    icon: GiThirdEye,
    details: {
      maxLv: 3,
      timing: 'オートアクション',
      skill: 'なし',
      target: '単体',
      range: '中距離',
      cost: '4',
      effect:
        '対象が何らかの判定を行う直前に使用する。対象が行う判定の判定値に＋[Ｌｖ×１0]％か－[Ｌｖ×１０]％する。１ラウンドに１回使用可能。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《オリジン：身体機能強化》',
    icon: GiBiceps,
    details: {
      maxLv: 1,
      timing: '常時',
      skill: 'なし',
      target: '自身',
      range: '単体',
      cost: 'なし',
      effect:
        '能力値をひとつ選択する。あなたの【超常】能力値を－１し、選択した能力値を＋１する。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《オリジン：空間転移》',
    icon: GiStarFormation,
    details: {
      maxLv: 1,
      timing: 'ムーブアクション',
      skill: 'なし',
      target: '単体',
      range: '至近',
      cost: '4',
      effect:
        '対象をシーンの任意の距離に移動させる。この移動の際、対象は移動を妨害されない。同意を得た対象にのみ使用できる。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《オリジン：プレコグニション》',
    icon: GiThirdEye,
    details: {
      maxLv: 3,
      timing: 'スタートプロセス',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '6',
      effect:
        'あなたはそのラウンド中、メジャーアクションとリアクションの判定の判定値に＋[Ｌｖ×１０]する。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《オリジン：物体動作支配》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 1,
      timing: 'スタートプロセス',
      skill: 'なし',
      target: '効果参照',
      range: '中距離',
      cost: '8',
      effect:
        '射程内のエンゲージをひとつ対象とする。対象のエンゲージを封鎖する。あなたは行動終了となる。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《サイコインパクト》',
    icon: GiBrain,
    details: {
      maxLv: 5,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '5',
      effect:
        '《オリジン：エレメント》《オリジン：空間転移》《オリジン：物体動作支配》のみ取得可能。あなたがこのメインプロセス中に行う攻撃のダメージに＋[Ｌｖ×２]する。また、その攻撃でダメージを与えた場合、ダメージを受けたキャラクターを１段階移動させてもよい。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《多重能力者》',
    icon: GiBrain,
    details: {
      maxLv: 1,
      timing: '常時',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'なし',
      effect:
        'あなたは、取得していない《オリジン：○○》という名前のヒーロースキルを一種類選択し、取得することが可能になる。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
  {
    name: '《能力暴走》',
    icon: GiBrain,
    details: {
      maxLv: 3,
      timing: 'スタートプロセス',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '8',
      effect:
        '《オリジン：エレメント》《オリジン：精神感応能力》《オリジン：物体動作支配》のみ取得可能。そのラウンド中、あなたが行う〈超能力〉判定の判定値に＋５０％し、メジャーアクションのコンボ数に＋１する。あなたはそのラウンド中、メインプロセスの終了時にＨＰが０になる。シーンにＬｖ回まで使用可能。',
    } as SkillDetails,
    color: 'bg-pink-50 border-pink-200',
  },
];

export const technologySkills = [
  {
    name: '《スペシャルツール》',
    icon: GiMechanicalArm,
    details: {
      maxLv: 5,
      timing: '常時',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'なし',
      effect:
        'テクノロジー専用アイテムを１つ取得する。このヒーロースキルのＬｖが３以上になったならば追加で１つ、Ｌｖが５以上になったならば更に追加で１つ取得する',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《アイテムボックス》',
    icon: GiTinker,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '〈製作〉',
      target: '装備ひとつ',
      range: '至近',
      cost: '6',
      effect:
        '装備ひとつを対象に〈製作〉技能での判定を行う。判定に成功したならば、対象の「攻撃力」「防護点」「ガード値」「修正」の内のひとつを＋[Ｌｖ＋１]する。同じ装備品の同じデータに対しては効果は重複しない。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《ツールファイト》',
    icon: GiRifle,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '〈操縦〉〈射撃〉',
      target: '単体',
      range: '武器',
      cost: '4',
      effect:
        'このヒーロースキルを組み合わせた〈操縦〉〈射撃〉技能の判定値を＋[（Ｌｖ×１０）＋１０]％する。攻撃に組み合わせて使用した場合、コンボ２として扱う。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《バリア発生装置》',
    icon: GiShield,
    details: {
      maxLv: 5,
      timing: 'オート',
      skill: 'なし',
      target: '単体',
      range: '近距離',
      cost: '4',
      effect:
        'ダメージロールの直後に使用する。対象が受けるダメージを[Ｌｖ×２]＋２Ｄ軽減する。ラウンドに１回使用可能。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《研究費用》',
    icon: GiShop,
    details: {
      maxLv: 10,
      timing: '常時',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'なし',
      effect: 'あなたは常備化点をＬｖ×５点追加で取得する。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《デポジッション》',
    icon: GiMechanicalArm,
    details: {
      maxLv: 1,
      timing: '行動値チェック',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '3',
      effect:
        'あなたの装備しているアイテムひとつを装備から外し、あなたの所持していることなるアイテムひとつを即座に装備する。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《リアクターパルス》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 3,
      timing: 'オート',
      skill: 'なし',
      target: '単体',
      range: '中',
      cost: '4',
      effect:
        '対象が何らかの判定を行う直前に使用する。対象の判定値を－[Ｌｖ×１０]％する。ラウンドに１回使用可能。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《エネルギーレイ》',
    icon: GiRifle,
    details: {
      maxLv: 3,
      timing: 'マイナー',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '6',
      effect:
        'あなたがそのメインプロセス中に行う攻撃ではダメージを＋[Ｌｖ×３]し、防護点を無視してダメージを算出する。シーンにＬｖ回使用可能。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《バラージショット》',
    icon: GiRifle,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '〈射撃〉',
      target: '範囲（選択）',
      range: '武器',
      cost: '7',
      effect:
        'このヒーロースキルを組み合わせた攻撃の対象を範囲（選択）に変更する。また、この攻撃のダメージに[Ｌｖ＋５]する。シーンに１回使用可能。このヒーロースキルのＬｖが３以上になったならばシーンに２回、Ｌｖが５以上になったならばシーンに３回使用可能。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    name: '《リミッター解除》',
    icon: GiTicket,
    details: {
      maxLv: 3,
      timing: 'セットアップ',
      skill: 'なし',
      target: '効果参照',
      range: '至近',
      cost: 'ＦＣ',
      effect:
        'あなたが装備しているアイテムひとつを対象とする。ファンチットを任意の枚数消費し、対象の「攻撃力」「防護点」「ガード値」「行動値」「修正」のうち[消費したＦＣ]個に＋[（Ｌｖ×３）＋２]する。判定値への修正については＋[Ｌｖ×５]％する。シナリオに１回使用可能。',
    } as SkillDetails,
    color: 'bg-cyan-50 border-cyan-200',
  },
];

export const esperantoSkills = [
  {
    name: '《スペースファクター》',
    icon: GiKnifeThrust,
    details: {
      maxLv: 5,
      timing: 'メジャー',
      skill: '〈技術〉〈射撃〉',
      target: '単体',
      range: '武器',
      cost: '4',
      effect:
        'このヒーロースキルを組み合わせた〈技術〉〈射撃〉技能の判定値を＋[（Ｌｖ×１０）＋１０]％する。攻撃に組み合わせて使用した場合、コンボ２として扱う。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《特殊相対性フィールド》',
    icon: GiStarFormation,
    details: {
      maxLv: 5,
      timing: 'スタートプロセス',
      skill: 'なし',
      target: '範囲',
      range: '遠距離',
      cost: '5',
      effect: 'そのラウンド中、対象の行動値を－[Ｌｖ×３]する。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《空の音》',
    icon: GiStarFormation,
    details: {
      maxLv: 5,
      timing: 'メジャー',
      skill: '〈超能力〉',
      target: '単体',
      range: '中距離',
      cost: '6',
      effect:
        '対象が次に行う攻撃の判定値に＋[（Ｌｖ×１０）＋２０]％、ダメージに＋[Ｌｖ×３]する。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《パナシーア》',
    icon: GiHeartPlus,
    details: {
      maxLv: 1,
      timing: 'オート',
      skill: 'なし',
      target: '単体',
      range: '近距離',
      cost: '4',
      effect:
        '対象の受けているバッドステータスをすべて解除する。ラウンド１回使用可能。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《ブロッカービット》',
    icon: GiMechanicalArm,
    details: {
      maxLv: 5,
      timing: 'メジャー',
      skill: '〈技術〉',
      target: '範囲選択',
      range: '中距離',
      cost: '6',
      effect:
        'そのシーン中、対象の防護点を＋[（Ｌｖ×３）＋２]する。この効果は重複しない。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《フラッシュバーン》',
    icon: GiStarStruck,
    details: {
      maxLv: 1,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '3',
      effect:
        'あなたがこのメインプロセス中に行う攻撃でダメージを与えた場合、ＢＳ：放心を与える。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《フューチャールール》',
    icon: GiStarFormation,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '〈技術〉〈射撃〉',
      target: '単体',
      range: '武器',
      cost: '6',
      effect:
        '対象に白兵攻撃か射撃攻撃を行う。コンボ２。攻撃のダメージに＋[（Ｌｖ×２）＋２]、判定値に＋２０％する。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《エナジードレイン》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 3,
      timing: 'オート',
      skill: 'なし',
      target: '効果参照',
      range: '中距離',
      cost: '10',
      effect:
        'キャラクターをふたり選択する。選択した内の一方が次に行う判定の判定値に－４０％、もう一方の次に行う判定の判定値に＋４０％する。シナリオにＬｖ回使用可能。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《未来技術》',
    icon: GiUpgrade,
    details: {
      maxLv: 1,
      timing: 'オート',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '12',
      effect:
        'あなたはシーン中に使用されたスキルをひとつ選択し、そのスキルをこのシーン中、１レベルで修得する。シナリオに１回使用可能。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: '《ギャラクシーガーディアン》',
    icon: GiTicket,
    details: {
      maxLv: 1,
      timing: 'マイナー',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'ＦＣ',
      effect:
        'ファンチットを任意の枚数消費する。あなたはこのメインプロセスに行う行動の対象を[消費したＦＣ÷２]体に、射程を視界に変更する。ただし、メインプロセスに攻撃を行う場合、コンボ数は３以上にならない。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
];

export const bioSkills = [
  {
    name: '《疾風の健脚》',
    icon: GiWalk,
    details: {
      maxLv: 5,
      timing: '常時',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'なし',
      effect: 'あなたの行動値に常に＋[（Ｌｖ×２）＋２]する。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《ネイチャーセンス》',
    icon: GiAlliedStar,
    details: {
      maxLv: 5,
      timing: 'マイナー',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '3',
      effect:
        'あなたはこのメインプロセスで行う〈知覚〉か〈心理〉の判定に＋[（Ｌｖ×10）＋10]％する。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《限定獣化》',
    icon: GiFist,
    details: {
      maxLv: 5,
      timing: 'マイナー',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '3',
      effect:
        'そのシーン中、あなたの素手のデータを以下のように変更する。種別：白兵　技能：〈パワー〉　修正：＋１０％　攻撃力：＋[Ｌｖ＋６]　ガード値：２　射程：至近',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《エンタングルアーム》',
    icon: GiSwordsPower,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '白兵攻撃',
      target: '単体',
      range: '近',
      cost: '4',
      effect:
        '対象に白兵攻撃を行う。コンボ２。このヒーロースキルを組み合わせた攻撃の射程を「近距離」に変更し、ダメージに＋[Ｌｖ×２]する。このヒーロースキルのＬｖが４以上になったならば、射程を「中距離」に変更する。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《バイオパワー》',
    icon: GiBiceps,
    details: {
      maxLv: 5,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '4',
      effect:
        'あなたがこのメインプロセス中に行う攻撃の判定に＋[Ｌｖ×２０]％する。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《ラッシングライフ》',
    icon: GiSwordsPower,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '白兵攻撃',
      target: '単体',
      range: '武器',
      cost: '3',
      effect:
        '対象に白兵攻撃を行う。コンボ２。このヒーロースキルを組み合わせた攻撃のダメージに＋[（Ｌｖ×２）＋２]点する。このヒーロースキルのＬｖが４以上になったならばコンボ数を＋１してもよい。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《スリップショック》',
    icon: GiGooExplosion,
    details: {
      maxLv: 5,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '5',
      effect:
        'あなたがこのメインプロセス中に行う攻撃でダメージを与えた場合、ＢＳ：スリップ（Ｌｖ）とＢＳ：硬直を与える。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《刹那の間隙》',
    icon: GiAlliedStar,
    details: {
      maxLv: 3,
      timing: 'オート',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '6',
      effect:
        '何らかの判定を行う直前に使用する。その判定の判定値に＋[〈知覚〉判定値÷２]する。シーンにＬｖ回使用可能。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《強制神経加速》',
    icon: GiSwordsPower,
    details: {
      maxLv: 3,
      timing: 'メジャーアクション',
      skill: '白兵攻撃',
      target: '単体',
      range: '武器',
      cost: '8',
      effect:
        '対象に白兵攻撃を行う。その攻撃のコンボ数を＋１し、判定値を＋３０％する。あなたはこのヒーロースキルを使用したメインプロセスの終了時に１０点のＨＰダメージを受ける。シナリオにＬｖ回使用可能。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: '《ビーストウィズイン》',
    icon: GiTicket,
    details: {
      maxLv: 1,
      timing: 'セットアップ',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'ＦＣ',
      effect:
        'ファンチットを任意の枚数消費する。あなたはそのラウンド中、消費したファンチット５枚ごとに以下の内から効果を１つ選び受ける。シナリオに１回使用可能。「与えるダメージ＋１Ｄ」「メジャーアクションの判定値＋４０％」「リアクションの判定値＋４０％」「行動値＋５」「防護点＋１０」',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
];

export const artsSkills = [
  {
    name: '《コンバットアーツ》',
    icon: GiKnifeThrust,
    details: {
      maxLv: 1,
      timing: 'メジャーアクション',
      skill: '〈技術〉',
      target: '単体',
      range: '武器',
      cost: '2',
      effect:
        '対象に白兵攻撃または射撃攻撃を行う。コンボ２。この攻撃では武器に設定された技能に関わらず〈技術〉で判定を行う。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《技巧の極み》',
    icon: GiKnifeThrust,
    details: {
      maxLv: 5,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '4',
      effect:
        'あなたがこのメインプロセス中に行う攻撃の判定に＋[Ｌｖ×２０]％する。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《マルチウェポン》',
    icon: GiKnifeThrust,
    details: {
      maxLv: 3,
      timing: 'メジャーアクション',
      skill: '〈技術〉',
      target: '単体',
      range: '武器',
      cost: '6',
      effect:
        'このヒーロースキルを組み合わせた攻撃では装備している武器の攻撃力を合計することができる。この攻撃の判定値に－[４０－（Ｌｖ×10）]する。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《ドッジロール》',
    icon: GiWalk,
    details: {
      maxLv: 5,
      timing: 'リアクション',
      skill: '〈運動〉',
      target: '自身',
      range: 'なし',
      cost: '3',
      effect:
        'このヒーロースキルを組み合わせたドッジの判定値に＋[（Ｌｖ×１０）＋２０]％する。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《タクティクスコマンド》',
    icon: GiSpeaker,
    details: {
      maxLv: 3,
      timing: 'スタートプロセス',
      skill: '〈情報〉〈心理〉',
      target: '範囲選択',
      range: '至近',
      cost: '8',
      effect:
        '〈情報〉か〈心理〉の判定を行う。判定に成功した場合、対象がそのラウンド中に与えるダメージに＋[Ｌｖ×３]する。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《ウェポンキャプチャー》',
    icon: GiKnifeThrust,
    details: {
      maxLv: 1,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '4',
      effect:
        'あなたがこのメインプロセスで行う白兵攻撃でダメージを与えたならば、BS捕縛を与える。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《アウトレンジスナイプ》',
    icon: GiCrosshair,
    details: {
      maxLv: 3,
      timing: 'メジャーアクション',
      skill: '〈射撃〉',
      target: '単体',
      range: '効果参照',
      cost: '8',
      effect:
        '対象に射撃攻撃を行う。コンボ２．このヒーロースキルを組み合わせた攻撃の射程は[使用した武器の射程＋１段階]となる。この攻撃に対するドッジの判定値に－[Ｌｖ×２０]％する。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《アンティルブレイク》',
    icon: GiKnifeThrust,
    details: {
      maxLv: 3,
      timing: 'メジャーアクション',
      skill: '〈技術〉',
      target: '単体',
      range: '武器',
      cost: '10',
      effect:
        '対象に白兵攻撃か射撃攻撃を行う。その攻撃のコンボ数を＋１し、判定値を＋２０％する。このヒーロースキルを組み合わせた攻撃のダメージに＋[Ｌｖ×３]する。シナリオにＬｖ回使用可能。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《フォローアップショット》',
    icon: GiCrosshair,
    details: {
      maxLv: 3,
      timing: 'オート',
      skill: 'なし',
      target: '単体',
      range: '近距離',
      cost: '8',
      effect:
        '対象が何らかの判定を行った直後に使用する。その判定を振り直させる。シーンにＬｖ回使用可能。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
  {
    name: '《デッドカウンター》',
    icon: GiTicket,
    details: {
      maxLv: 1,
      timing: 'リアクション',
      skill: '〈運動〉',
      target: '自身',
      range: 'なし',
      cost: 'ＦＣ',
      effect:
        'ファンチットを１０枚消費する。ドッジの判定に＋４０％する。その後、リアクションに成功した回数だけ装備した武器を使用した攻撃を行う。この攻撃の対象はリアクションの対決を行ったキャラクターとなり、この攻撃に対するリアクションは発生しない。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
];

export const artifactSkills = [
  {
    name: '《古代兵装》',
    icon: GiAncientSword,
    details: {
      maxLv: 5,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '4',
      effect:
        'そのシーン中、以下のデータの武器を作成し、装備する。このヒーロースキルのレベルが３以上になったならば、この武器による攻撃によるダメージは防護点を－[Ｌｖ×２]して算出する。種別：白兵　技能：〈パワー〉〈技術〉　修正：０％　攻撃力：＋[Ｌｖ＋７]　ガード値：４　射程：至近',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《ミスティックアーマー》',
    icon: GiChestArmor,
    details: {
      maxLv: 5,
      timing: 'マイナー',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '4',
      effect: 'あなたが装備している防具の防護点を[Ｌｖ×４]する。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《神聖なる献身》',
    icon: GiShieldBash,
    details: {
      maxLv: 1,
      timing: 'オート',
      skill: 'なし',
      target: '単体',
      range: '至近',
      cost: '4',
      effect:
        '対象がリアクションを行った直前に使用する。対象への攻撃に対しカバーリングを行い、このメインプロセス中に受けるダメージを５点軽減する。あなたはこのヒーロースキルによるカバーリングで行動終了にならず、行動終了していても使用できる。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《守護神の加護》',
    icon: GiShieldBash,
    details: {
      maxLv: 5,
      timing: 'リアクション',
      skill: '技能',
      target: '自身',
      range: 'なし',
      cost: '3',
      effect:
        'ガード時に使用する。そのメインプロセス中、あなたのガード値を＋[Ｌｖ×４]する。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《オーラバトラー》',
    icon: GiAncientSword,
    details: {
      maxLv: 5,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '3',
      effect:
        'このメインプロセス中、あなたがアーティファクトのヒーロースキルを使用した判定を行う際、判定値に＋[Ｌｖ×２０]％する。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《エンシェントスペル》',
    icon: GiSpellBook,
    details: {
      maxLv: 1,
      timing: 'メジャーアクション',
      skill: '〈魔術〉',
      target: '単体',
      range: '中距離',
      cost: '5',
      effect:
        '対象に特殊攻撃を行う。コンボ2。このヒーロースキルを組み合わせた攻撃のダメージに＋[装備している武器の攻撃力]する。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《グラディエーター》',
    icon: GiAncientSword,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '白兵攻撃',
      target: '単体',
      range: '武器',
      cost: '3',
      effect:
        '対象に白兵攻撃を行う。コンボ２。このヒーロースキルを組み合わせた攻撃のダメージに＋[Ｌｖ×３]する。このヒーロースキルのＬｖが４以上になったならばコンボ数を＋１してもよい。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《黄金の果実》',
    icon: GiHeartPlus,
    details: {
      maxLv: 3,
      timing: '行動値チェック',
      skill: 'なし',
      target: '単体',
      range: '至近',
      cost: '12',
      effect:
        '戦闘不能状態のキャラクターを対象とする。その戦闘不能状態を解除し、HPを[Ｌｖ×２０]点回復する。このヒーロースキルはあなたが戦闘不能状態でも使用できる。シナリオに１回使用可能。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《ランページオーラ》',
    icon: GiAncientSword,
    details: {
      maxLv: 3,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '8',
      effect:
        'このメインプロセス中、あなたが行う攻撃に対してガードを行えない。１シナリオに１回。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: '《ジャッジメントボルト》',
    icon: GiStarStruck,
    details: {
      maxLv: 3,
      timing: '行動値チェック',
      skill: 'なし',
      target: '単体',
      range: '視界',
      cost: 'ＦＣ',
      effect:
        'ファンチットを５枚消費する。対象に５DのHPダメージを与える。ラウンドに１回、シナリオにレベル回使用可能。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
];

export const muscleSkills = [
  {
    name: '《パワードライブ》',
    icon: GiSwordsPower,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '白兵攻撃',
      target: '単体',
      range: '武器',
      cost: '4',
      effect:
        '対象に白兵攻撃を行う。コンボ２。このヒーロースキルを組み合わせた攻撃のダメージに＋[Ｌｖ×４]する。このヒーロースキルのＬｖが４以上になったならばコンボ数を＋１してもよい。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《マッスルチャージ》',
    icon: GiSwordsPower,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '〈パワー〉',
      target: '単体',
      range: '至近',
      cost: '3',
      effect:
        'このヒーロースキルを組み合わせた〈パワー〉技能の判定値を＋[Ｌｖ×２０]％する。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《バイタルアップ》',
    icon: GiHeartPlus,
    details: {
      maxLv: 10,
      timing: '常時',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'なし',
      effect: 'あなたの最大ＨＰを＋[Ｌｖ×５]する。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《即席巨大武器》',
    icon: GiSwordsPower,
    details: {
      maxLv: 5,
      timing: 'マイナーアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '4',
      effect:
        'そのシーンの間、以下のデータの武器を作成し装備する。このヒーロースキルのＬｖが３以上になったならば、この武器を用いて「対象：範囲」に攻撃を行ってもよい。\n種別：白兵\n技能：〈パワー〉\n修正：－２０％\n攻撃力：＋[Ｌｖ＋９]\nガード値：６\n射程：至近',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《ボディウォール》',
    icon: GiShieldBash,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '単体',
      range: '至近',
      cost: '2',
      effect:
        '対象がリアクションを行った直前に使用する。対象への攻撃に対しカバーリングを行う。あなたはこのヒーロースキルによるカバーリングで行動終了にならず、行動終了していても使用できる。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《アダプテーション》',
    icon: GiUpgrade,
    details: {
      maxLv: 3,
      timing: 'スタートプロセス',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '6',
      effect:
        '「白兵攻撃の判定」「ドッジの判定」の内からひとつを選択する。そのラウンド中、選択した判定値を＋[Ｌｖ×２０％]する。またそのラウンド中、「攻撃力」「防護点」「行動値」のいずれかに＋３する。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《肉体硬化》',
    icon: GiShieldBash,
    details: {
      maxLv: 5,
      timing: 'リアクション',
      skill: '技能',
      target: '自身',
      range: 'なし',
      cost: '4',
      effect:
        'ガード判定を行う。そのメインプロセス中、あなたのガード値を＋[Ｌｖ×４]＋１Ｄする。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《フルパワーアタック》',
    icon: GiSwordsPower,
    details: {
      maxLv: 3,
      timing: 'ムーブアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: '6',
      effect:
        'あなたがそのメインプロセス中に行う白兵攻撃ではダメージを＋[Ｌｖ×５]する。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《スピードフォース》',
    icon: GiSwordsPower,
    details: {
      maxLv: 3,
      timing: 'メジャーアクション',
      skill: '〈パワー〉',
      target: '単体',
      range: '至近',
      cost: '8',
      effect:
        '対象に白兵攻撃を行う。コンボ２。その攻撃のダメージに＋[行動値]する。シーンにＬｖ回使用可能。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: '《ビルドアップストライク》',
    icon: GiTicket,
    details: {
      maxLv: 5,
      timing: 'オート',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'ＦＣ',
      effect:
        'ファンチットを５枚消費する。ダメージロールの直前に使用する。そのダメージロールに＋３Ｄする。シーンに１回使用可能。このヒーロースキルのＬｖが３以上になったならばシナリオに２回、Ｌｖが５以上になったならばシナリオに３回使用可能。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
];

export const ultimateSkills = [
  {
    name: 'ダメージブースト',
    icon: GiSwordsPower,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '単体',
      range: '視界',
      cost: 'なし',
      effect:
        '対象のダメージロールの直前に使用する。この必殺技を使用したダメージロールに＋[現在のラウンド数×１０]する。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-red-50 border-red-200',
  },
  {
    name: 'リザレクション',
    icon: GiHeartPlus,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '単体',
      range: '視界',
      cost: 'なし',
      effect:
        'いずれかのキャラクターが戦闘不能になった際に使用する。戦闘不能状態を解除する。その後、対象が自分であればＨＰを最大値まで回復し、対象が自分以外のキャラクターであれば、ＨＰを最大値の半分まで回復する。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-green-50 border-green-200',
  },
  {
    name: 'ファンアピール',
    icon: GiTicket,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'なし',
      effect:
        'いつでも使用できる。ファンチットを５枚獲得する。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: 'カルネージアタック',
    icon: GiGooExplosion,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '自身',
      range: 'なし',
      cost: 'なし',
      effect:
        'メジャーアクションの直前に使用する。この必殺技を使用した次の攻撃の射程を視界に、対象を場面（選択）に変更し、ダメージに＋５する。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-orange-50 border-orange-200',
  },
  {
    name: 'スキルアッパー',
    icon: GiUpgrade,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '単体',
      range: '視界',
      cost: 'なし',
      effect:
        '対象が何らかの判定の直前に使用する。対象が行う判定の判定値に＋[現在のラウンド数×３０]％する。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-blue-50 border-blue-200',
  },
  {
    name: 'ディスティニールーラー',
    icon: GiStarStruck,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '単体',
      range: '視界',
      cost: 'なし',
      effect:
        '対象が何らかの判定を行った直後に使用する。その判定の結果をクリティカルに変更する。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-purple-50 border-purple-200',
  },
  {
    name: 'フェイトダークサイド',
    icon: GiDeathSkull,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '単体',
      range: '視界',
      cost: 'なし',
      effect:
        '対象が何らかの判定を行った直後に使用する。その判定の結果をファンブルに変更する。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-gray-50 border-gray-200',
  },
  {
    name: 'フルディフェンス',
    icon: GiShieldBash,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '単体',
      range: '視界',
      cost: 'なし',
      effect:
        '対象の攻撃の判定の直前に使用する。攻撃の対象を自分のみに変更し、そのメインプロセス中、受けるダメージを－[現在のラウンド数×５]する。シナリオに１回まで使用可能。',
    } as SkillDetails,
    color: 'bg-teal-50 border-teal-200',
  },
];
