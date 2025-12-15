import { Card } from './Card';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-600">カードタイトル</h3>
        <p className="text-gray-600 mb-4">これはカードコンポーネントのサンプルコンテンツです。</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          アクション
        </button>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutHover: Story = {
  args: {
    variant: 'default',
  },
};

export const CustomClass: Story = {
  args: {
    className: 'border-2 border-purple-200',
    children: (
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 text-purple-600">カスタムスタイル</h3>
        <p className="text-gray-600">カスタムクラス名を適用したカード</p>
      </div>
    ),
  },
};

export const SimpleContent: Story = {
  args: {
    children: <p className="text-gray-700">シンプルなテキストコンテンツ</p>,
  },
};