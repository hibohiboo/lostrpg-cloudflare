import { Layout } from '../components/Layout';
import { RulesPage } from './RulesPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof RulesPage> = {
  title: 'Pages/RulesPage',
  component: RulesPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Layout title="ルール - Age of Hero TRPG">
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