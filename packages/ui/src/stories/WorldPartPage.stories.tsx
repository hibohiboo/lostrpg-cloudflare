import { Layout } from '../components/Layout';
import { WorldPartPage } from '../pages/WorldPartPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/World/WorldPartPage',
  component: WorldPartPage,
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
} satisfies Meta<typeof WorldPartPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};