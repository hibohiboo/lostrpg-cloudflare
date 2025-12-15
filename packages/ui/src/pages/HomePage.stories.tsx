import { Layout } from '../components/Layout';
import { HomePage } from './HomePage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutLayout: Story = {
  decorators: [],
};