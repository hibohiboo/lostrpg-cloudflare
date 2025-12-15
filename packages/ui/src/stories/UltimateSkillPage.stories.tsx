import { Layout } from '../components/Layout';
import { UltimateSkillPage } from '../pages/UltimateSkillPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Rules/UltimateSkillPage',
  component: UltimateSkillPage,
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
} satisfies Meta<typeof UltimateSkillPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};