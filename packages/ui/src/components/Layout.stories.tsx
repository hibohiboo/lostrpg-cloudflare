import { Layout } from './Layout';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h2 className="text-2xl font-bold mb-4">サンプルコンテンツ</h2>
        <p>これはレイアウトコンポーネントのサンプルです。</p>
      </div>
    ),
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'カスタムタイトル - Age of Hero TRPG',
    children: (
      <div>
        <h2 className="text-2xl font-bold mb-4">カスタムタイトルページ</h2>
        <p>カスタムタイトルが設定されたレイアウトです。</p>
      </div>
    ),
  },
};