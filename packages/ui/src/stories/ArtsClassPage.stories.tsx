import { Layout } from '../components/Layout';
import { ArtsClassPage } from '../pages/ArtsClassPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Classes/ArtsClassPage',
  component: ArtsClassPage,
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
} satisfies Meta<typeof ArtsClassPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};