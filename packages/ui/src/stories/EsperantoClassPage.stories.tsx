import { Layout } from '../components/Layout';
import { EsperantoClassPage } from '../pages/EsperantoClassPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Classes/EsperantoClassPage',
  component: EsperantoClassPage,
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
} satisfies Meta<typeof EsperantoClassPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};