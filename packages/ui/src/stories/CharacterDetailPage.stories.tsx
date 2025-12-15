import {
  CharacterDetailPage,
  type CharacterDetail,
} from '../pages/CharacterDetailPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof CharacterDetailPage> = {
  title: 'Pages/CharacterDetailPage',
  component: CharacterDetailPage,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCharacter: CharacterDetail = {
  id: '1',
  name: '山田太郎',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z',
  // API直接プロパティ
  selectedClasses: ['マッスル', 'テクノロジー'],
  abilityBonus: 'physical',
  skillAllocations: {
    パワー: 20,
    技術: 20,
    運動: 30,
    タフネス: 5,
    知覚: 5,
    情報: 10,
    交渉: 5,
  },
  heroSkills: [
    {
      name: 'パワードライブ',
      level: 3,
      maxLevel: 7,
      timing: 'メジャーアクション',
      skill: 'パワー',
      target: '単体',
      range: '近接',
      cost: 3,
      effect: 'パワー+レベルで攻撃。成功時追加ダメージ。',
    },
    {
      name: 'ファイトバック',
      level: 2,
      maxLevel: 5,
      timing: 'リアクション',
      skill: '運動',
      target: '自分',
      range: '自分',
      cost: 2,
      effect: '攻撃を受けた際、回避判定に+レベルのボーナス。',
    },
  ],
  specialAttacks: [
    {
      name: 'パワースマッシュ',
      level: 4,
      maxLevel: 7,
      timing: 'メジャーアクション',
      skill: 'パワー',
      target: '単体',
      range: '近接',
      cost: 4,
      effect: '近接攻撃。成功時ダメージ+レベル。対象は1ラウンド行動不能。',
    },
  ],
  items: [
    {
      name: '特製グローブ',
      type: '白兵',
      skill: 'パワー',
      modifier: '+5%',
      attackPower: '+2',
      guardValue: '1',
      range: '至近',
      price: 25,
      effect: '近接攻撃の命中率が向上する特製グローブ',
    },
    {
      name: 'エナジードリンク',
      type: '消耗品',
      price: 15,
      effect: 'マイナーアクションで使用可能。HPを2D点回復する。',
      quantity: 3,
    },
  ],
  sessions: [
    {
      id: 'session1',
      sessionName: '街に現れた怪物',
      gmName: '佐藤GM',
      sessionDate: '2024-01-20',
      currentHp: 65,
      currentSp: 40,
      currentFc: 12,
      experiencePoints: 15,
      memo: '初回セッション。チームワークが良かった。',
      createdAt: '2024-01-20T22:30:00Z',
    },
    {
      id: 'session2',
      sessionName: '地下施設の謎',
      gmName: '佐藤GM',
      sessionDate: '2024-01-27',
      currentHp: 68,
      currentSp: 35,
      currentFc: 8,
      experiencePoints: 18,
      memo: '謎解きが難しかったが、最終的に解決できた。新しいスキルを習得。',
      createdAt: '2024-01-27T23:15:00Z',
    },
  ],
};

export const Default: Story = {
  args: {
    character: sampleCharacter,
    loading: false,
    error: null,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Errors: Story = {
  args: {
    loading: false,
    error: 'キャラクターの取得に失敗しました',
    onRetry: () => console.log('Retry clicked'),
  },
};

export const NotFound: Story = {
  args: {
    character: undefined,
    loading: false,
    error: null,
  },
};

export const MinimalCharacter: Story = {
  args: {
    character: {
      id: '2',
      name: '新人ヒーロー',
      createdAt: '2024-01-25T12:00:00Z',
      updatedAt: '2024-01-25T12:00:00Z',
      selectedClasses: ['バイオ', 'バイオ'],
      abilityBonus: 'physical',
      skillAllocations: {
        パワー: 0,
        運動: 20,
      },
      heroSkills: [],
      specialAttacks: [],
      items: [],
      sessions: [],
    },
    loading: false,
    error: null,
  },
};
