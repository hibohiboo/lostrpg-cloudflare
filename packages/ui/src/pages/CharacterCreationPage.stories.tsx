import { Layout } from '../components/Layout';
import { CharacterCreationPage } from './CharacterCreationPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof CharacterCreationPage> = {
  title: 'Pages/CharacterCreationPage',
  component: CharacterCreationPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Layout title="キャラクター作成 - Age of Hero TRPG">
        <Story />
      </Layout>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutLayout: Story = {
  decorators: [],
};