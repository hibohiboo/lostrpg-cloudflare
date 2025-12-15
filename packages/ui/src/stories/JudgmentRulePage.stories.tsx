import { Layout } from '../components/Layout';
import { JudgmentRulePage } from '../pages/JudgmentRulePage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Rules/JudgmentRulePage',
  component: JudgmentRulePage,
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
} satisfies Meta<typeof JudgmentRulePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
