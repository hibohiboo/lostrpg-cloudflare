import { CharacterCreationForm } from './CharacterCreationForm';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mockExternalSkills = [
  {
    name: '限定獣化',
    maxLv: 5,
    timing: 'メジャーアクション',
    skill: '〈白兵〉',
    target: '自身',
    range: '自身',
    const: 'SP3',
    effect: '素手での攻撃力を上昇させる獣化能力',
    class: 'バイオ',
  },
  {
    name: 'マッスルパワー',
    maxLv: 5,
    timing: 'メジャーアクション',
    skill: '〈白兵〉',
    target: '自身',
    range: '自身',
    const: 'SP2',
    effect: '筋力を強化して攻撃力を上昇させる',
    class: 'マッスル',
  },
  {
    name: 'サイコブラスト',
    maxLv: 3,
    timing: 'メジャーアクション',
    skill: '〈超常〉',
    target: '単体',
    range: '視界',
    const: 'SP4',
    effect: '精神攻撃でダメージを与える',
    class: 'サイキック',
  },
];

const meta: Meta<typeof CharacterCreationForm> = {
  title: 'Components/CharacterCreationForm',
  component: CharacterCreationForm,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Character creation submitted:', data);
    },
    isLoading: false,
    externalSkills: mockExternalSkills,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Character creation submitted:', data);
    },
    isLoading: true,
    externalSkills: mockExternalSkills,
  },
};

export const WithoutExternalSkills: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Character creation submitted:', data);
    },
    isLoading: false,
    externalSkills: [],
  },
};
