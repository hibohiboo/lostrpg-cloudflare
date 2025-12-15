import { Layout } from '../components/Layout';
import { HeroBirthPage } from '../pages/HeroBirthPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/World/HeroBirthPage',
  component: HeroBirthPage,
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
} satisfies Meta<typeof HeroBirthPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};