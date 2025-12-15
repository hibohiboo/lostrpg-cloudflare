import { PageHeader } from './PageHeader';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'ページタイトル',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    title: 'キャラクター作成',
    description: 'Age of Heroの世界で活躍するヒーローキャラクターを作成します。数値的なデータ、ヒーロースキル、アイテム、個人的背景によって定義されます。',
  },
};

export const Centered: Story = {
  args: {
    title: 'Age of Hero TRPG',
    description: 'ヒーローになって世界を救おう！様々なクラスと能力を組み合わせて、あなただけのキャラクターを作成できます。',
    centered: true,
  },
};

export const CenteredWithoutDescription: Story = {
  args: {
    title: 'シンプルタイトル',
    centered: true,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'とても長いページタイトルの例：Age of Hero TRPGキャラクター作成ガイド完全版',
    description: '長いタイトルがどのように表示されるかを確認するためのストーリーです。',
  },
};