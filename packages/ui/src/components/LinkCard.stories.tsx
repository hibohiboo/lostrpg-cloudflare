import { LinkCard } from './LinkCard';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof LinkCard> = {
  title: 'Components/LinkCard',
  component: LinkCard,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'ルール',
    description: 'ゲームの基本的なルールとシステムについて学べます。',
    href: '/rules',
    buttonText: 'ルールを見る',
    color: 'blue',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LinkCard
        title="ブルー"
        href="#"
        buttonText="見る"
        color="blue"
      />
      <LinkCard
        title="グリーン"
        href="#"
        buttonText="見る"
        color="green"
      />
      <LinkCard
        title="パープル"
        href="#"
        buttonText="見る"
        color="purple"
      />
      <LinkCard
        title="レッド"
        href="#"
        buttonText="見る"
        color="red"
      />
      <LinkCard
        title="オレンジ"
        href="#"
        buttonText="見る"
        color="orange"
      />
      <LinkCard
        title="イエロー"
        href="#"
        buttonText="見る"
        color="yellow"
      />
      <LinkCard
        title="ティール"
        href="#"
        buttonText="見る"
        color="teal"
      />
    </div>
  ),
};

export const WithoutDescription: Story = {
  args: {
    title: 'キャラクター作成',
    href: '/character',
    buttonText: 'キャラクター作成',
    color: 'purple',
  },
};

export const LongContent: Story = {
  args: {
    title: 'とても長いタイトルのカードの例：Age of Hero TRPGキャラクター作成ガイド',
    description: 'これはとても長い説明文の例です。Age of Heroの世界で活躍するヒーローキャラクターを作成するための詳細なガイドとなっています。様々なクラスと能力を組み合わせて、あなただけのオリジナルキャラクターを作成することができます。',
    href: '/character',
    buttonText: '詳しく見る',
    color: 'green',
  },
};

export const HomePageExample: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <LinkCard
        title="ルール"
        description="ゲームの基本的なルールとシステムについて学べます。"
        href="/rules"
        buttonText="ルールを見る"
        color="blue"
      />
      <LinkCard
        title="ワールド"
        description="Age of Heroの世界観と設定について詳しく知ることができます。"
        href="/world"
        buttonText="ワールドを見る"
        color="green"
      />
      <LinkCard
        title="キャラクター作成"
        description="あなた独自のヒーローキャラクターを作成するためのガイドです。"
        href="/character"
        buttonText="キャラクター作成"
        color="purple"
      />
    </div>
  ),
};