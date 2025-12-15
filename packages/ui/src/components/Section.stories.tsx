import { Section } from './Section';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Section> = {
  title: 'Components/Section',
  component: Section,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'セクションタイトル',
    children: (
      <div>
        <p className="text-gray-600 mb-4">
          これはセクションコンポーネントのサンプルコンテンツです。
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>項目1</li>
          <li>項目2</li>
          <li>項目3</li>
        </ul>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithStep: Story = {
  args: {
    title: 'クラス選択',
    step: 1,
    children: (
      <div>
        <p className="text-gray-600 mb-4">8種類のクラスから2つを選択できます。</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-red-100 text-red-800 rounded-lg text-center">マッスル</div>
          <div className="p-3 bg-blue-100 text-blue-800 rounded-lg text-center">テクノロジー</div>
        </div>
      </div>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    title: '作成手順',
    icon: '📋',
    children: (
      <div>
        <p className="text-gray-600">手順の説明が入ります。</p>
      </div>
    ),
  },
};

export const HighStepNumber: Story = {
  args: {
    title: '最終計算',
    step: 8,
    children: (
      <div className="space-y-3">
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <span className="font-semibold text-indigo-800">HP・SP算出:</span>
          <span className="text-gray-700 ml-2">生命力とスキルポイントの計算</span>
        </div>
      </div>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    title: 'カスタムセクション',
    step: 3,
    className: 'border-2 border-green-200',
    children: <p className="text-gray-600">カスタムクラスを適用したセクション</p>,
  },
};