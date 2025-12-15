import { Layout } from '../components/Layout';
import { ItemsPage } from '../pages/ItemsPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Rules/ItemsPage',
  component: ItemsPage,
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
} satisfies Meta<typeof ItemsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};