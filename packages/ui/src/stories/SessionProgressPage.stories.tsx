import { Layout } from '../components/Layout';
import { SessionProgressPage } from '../pages/SessionProgressPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Rules/SessionProgressPage',
  component: SessionProgressPage,
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
} satisfies Meta<typeof SessionProgressPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};