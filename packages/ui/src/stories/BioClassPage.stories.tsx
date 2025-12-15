import { Layout } from '../components/Layout';
import { BioClassPage } from '../pages/BioClassPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mockSkills = [
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
    name: 'バイオパワー',
    maxLv: 5,
    timing: 'リアクション',
    skill: '〈反射〉',
    target: '自身',
    range: '自身',
    const: 'SP2',
    effect: '動物の本能で攻撃を強化する',
    class: 'バイオ',
  },
  {
    name: 'ネイチャーセンス',
    maxLv: 3,
    timing: 'オート',
    skill: '〈知覚〉',
    target: '自身',
    range: '自身',
    const: 'なし',
    effect: '野生動物の感覚で周囲を探知する',
    class: 'バイオ',
  },
];

const meta = {
  title: 'Pages/Classes/BioClassPage',
  component: BioClassPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Layout title="Age of Hero TRPG">
        <Story />
      </Layout>
    ),
  ],
} satisfies Meta<typeof BioClassPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    skills: mockSkills,
  },
};

export const WithoutSkills: Story = {
  args: {
    skills: [],
  },
};