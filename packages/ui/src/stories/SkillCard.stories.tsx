import { GiMuscleUp, GiMagicSwirl } from 'react-icons/gi';
import { SkillCard } from '../components/SkillCard';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/SkillCard',
  component: SkillCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    color: {
      control: 'text',
      description: 'Background and border color classes',
    },
  },
} satisfies Meta<typeof SkillCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PowerDrive: Story = {
  args: {
    name: '《パワードライブ》',
    icon: GiMuscleUp,
    details: {
      maxLv: 5,
      timing: 'メジャーアクション',
      skill: '白兵攻撃',
      target: '単体',
      range: '武器',
      cost: 4,
      effect: '対象に白兵攻撃を行う。コンボ２。このヒーロースキルを組み合わせた攻撃のダメージに＋[Ｌｖ×４]する。このヒーロースキルのＬｖが４以上になったならばコンボ数を＋１してもよい。',
    },
    color: 'bg-red-50 border-red-200',
  },
};

export const MagicSkill: Story = {
  args: {
    name: '《ファイアボール》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 3,
      timing: 'メジャーアクション',
      skill: '特殊攻撃',
      target: '単体',
      range: '遠距離',
      cost: '3SP + 1FC',
      effect: '対象に魔術攻撃を行う。ダメージに＋[Ｌｖ×６]する。このスキルは防護点を無視する。',
    },
    color: 'bg-purple-50 border-purple-200',
  },
};

export const Default: Story = {
  args: {
    name: '《サンプルスキル》',
    icon: GiMagicSwirl,
    details: {
      maxLv: 1,
      timing: 'オートアクション',
      skill: 'なし',
      target: '自身',
      range: '至近',
      cost: 0,
      effect: 'サンプル効果の説明文です。',
    },
  },
};