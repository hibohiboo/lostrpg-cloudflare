import { CharacterListPage } from '../pages/CharacterListPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof CharacterListPage> = {
  title: 'Pages/CharacterListPage',
  component: CharacterListPage,
  parameters: {
    layout: 'padded',
  },
  args: {
    onRetry: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleCharacters = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'エルフの戦士',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-20T14:45:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'ドワーフの魔法使い',
    createdAt: '2024-01-10T09:15:00.000Z',
    updatedAt: '2024-01-18T16:20:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'ヒューマンの盗賊',
    createdAt: '2024-01-05T11:45:00.000Z',
    updatedAt: '2024-01-19T13:30:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'エルフの僧侶',
    createdAt: '2024-01-12T15:20:00.000Z',
    updatedAt: '2024-01-21T10:10:00.000Z',
  },
];

// 通常のキャラクター一覧
export const Default: Story = {
  args: {
    characters: sampleCharacters,
    loading: false,
    error: null,
  },
};

// 単一キャラクター
export const SingleCharacter: Story = {
  args: {
    characters: [sampleCharacters[0]],
    loading: false,
    error: null,
  },
};

// パスワード保護されたキャラクターのみ
export const PasswordProtectedOnly: Story = {
  args: {
    characters: sampleCharacters.filter((char) => char.isPasswordProtected),
    loading: false,
    error: null,
  },
};

// ローディング状態
export const Loading: Story = {
  args: {
    characters: [],
    loading: true,
    error: null,
  },
};

// エラー状態
export const Errors: Story = {
  args: {
    characters: [],
    loading: false,
    error:
      'サーバーに接続できませんでした。ネットワーク接続を確認してください。',
  },
};

// エラー状態（再試行ボタンなし）
export const ErrorWithoutRetry: Story = {
  args: {
    characters: [],
    loading: false,
    error: 'データの読み込みに失敗しました。',
    onRetry: undefined,
  },
};

// 空の状態
export const Empty: Story = {
  args: {
    characters: [],
    loading: false,
    error: null,
  },
};

// 大量のキャラクター
export const ManyCharacters: Story = {
  args: {
    characters: Array.from({ length: 20 }, (_, i) => ({
      id: `550e8400-e29b-41d4-a716-${(446655440000 + i + 1).toString().padStart(12, '0')}`,
      name: `キャラクター ${i + 1}`,
      createdAt: new Date(2024, 0, 1 + i, 10, 0, 0).toISOString(),
      updatedAt: new Date(2024, 0, 1 + i + 10, 14, 30, 0).toISOString(),
      isPasswordProtected: i % 3 === 0,
    })),
    loading: false,
    error: null,
  },
};

// 長い名前のキャラクター
export const LongNames: Story = {
  args: {
    characters: [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'とても長い名前のキャラクターでUIのレイアウトが崩れないかをテストするためのキャラクター',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-20T14:45:00.000Z',
        isPasswordProtected: false,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Another character with an extremely long name that should test the layout boundaries',
        createdAt: '2024-01-10T09:15:00.000Z',
        updatedAt: '2024-01-18T16:20:00.000Z',
        isPasswordProtected: true,
      },
    ],
    loading: false,
    error: null,
  },
};
