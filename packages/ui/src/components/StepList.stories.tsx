import { StepList } from './StepList';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof StepList> = {
  title: 'Components/StepList',
  component: StepList,
  parameters: {
    layout: 'padded',
  },
  args: {
    steps: [
      { number: 1, title: 'クラスを2つ選択', description: '8種類のクラスから好きな組み合わせを選択' },
      { number: 2, title: '基本能力値を計算', description: '選択したクラスに基づいて初期値を設定' },
      { number: 3, title: '追加の技能ポイント150%を分配', description: 'キャラクターの個性を表現する能力値の調整' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDescriptions: Story = {
  args: {
    steps: [
      { number: 1, title: 'ステップ1' },
      { number: 2, title: 'ステップ2' },
      { number: 3, title: 'ステップ3' },
      { number: 4, title: 'ステップ4' },
    ],
  },
};

export const SingleStep: Story = {
  args: {
    steps: [
      { number: 1, title: '単一ステップ', description: '一つだけのステップの例' },
    ],
  },
};

export const ManySteps: Story = {
  args: {
    steps: [
      { number: 1, title: 'クラス選択', description: '8種類のクラスから2つを選択' },
      { number: 2, title: '能力値設定', description: '基本能力値を計算' },
      { number: 3, title: 'ポイント分配', description: '技能ポイント150%を分配' },
      { number: 4, title: 'ヒーロースキル', description: '7レベルまでのスキルを習得' },
      { number: 5, title: '必殺技', description: '1レベルの必殺技を習得' },
      { number: 6, title: 'アイテム', description: '20点分のアイテムを購入' },
      { number: 7, title: 'HP・SP算出', description: '生命力とスキルポイントの計算' },
      { number: 8, title: '行動値決定', description: '戦闘時の行動順序を決める値を算出' },
    ],
  },
};