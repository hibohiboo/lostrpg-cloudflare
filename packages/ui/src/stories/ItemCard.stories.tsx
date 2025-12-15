import { GiFist, GiSwordSlice, GiRifle, GiShield } from 'react-icons/gi';
import { ItemCard } from '../components/ItemCard';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/ItemCard',
  component: ItemCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    color: {
      control: 'text',
      description: 'Background and border color classes',
    },
  },
} satisfies Meta<typeof ItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BareHands: Story = {
  args: {
    name: '《素手》',
    icon: GiFist,
    details: {
      type: '白兵',
      skill: '〈パワー〉',
      modifier: '０％',
      attackPower: '0',
      guardValue: '0',
      range: '至近',
      price: 0,
      effect:
        '武器が何も装備されていない場合、この武器が装備されているものとして扱う。',
    },
    color: 'bg-orange-50 border-orange-200',
  },
};

export const Sword: Story = {
  args: {
    name: '《ロングソード》',
    icon: GiSwordSlice,
    details: {
      type: '白兵',
      skill: '〈技術〉',
      modifier: '＋１０％',
      attackPower: '4',
      guardValue: '2',
      range: '至近',
      price: 500,
      effect: '一般的な長剣。バランスの取れた性能を持つ。',
    },
    color: 'bg-blue-50 border-blue-200',
  },
};

export const Rifle: Story = {
  args: {
    name: '《アサルトライフル》',
    icon: GiRifle,
    details: {
      type: '射撃',
      skill: '〈射撃〉',
      modifier: '＋２０％',
      attackPower: '6',
      guardValue: '0',
      range: '遠距離',
      price: 1200,
      effect: '軍用の自動小銃。高い攻撃力を持つが、近接戦闘には不向き。',
    },
    color: 'bg-red-50 border-red-200',
  },
};

export const Shield: Story = {
  args: {
    name: '《ラウンドシールド》',
    icon: GiShield,
    details: {
      type: '防具',
      skill: '-',
      modifier: '-',
      attackPower: '0',
      guardValue: '3',
      range: '-',
      price: 300,
      effect: '円形の盾。ガード時の防御力を向上させる。',
    },
    color: 'bg-green-50 border-green-200',
  },
};

export const Default: Story = {
  args: {
    name: '《サンプルアイテム》',
    icon: GiFist,
    details: {
      type: 'その他',
      skill: '-',
      modifier: '-',
      attackPower: '-',
      guardValue: '-',
      range: '-',
      price: 100,
      effect: 'サンプルアイテムの効果説明です。',
    },
  },
};
