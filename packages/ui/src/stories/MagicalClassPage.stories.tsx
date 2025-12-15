import { Layout } from '../components/Layout';
import { MagicalClassPage } from '../pages/MagicalClassPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Classes/MagicalClassPage',
  component: MagicalClassPage,
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
} satisfies Meta<typeof MagicalClassPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};