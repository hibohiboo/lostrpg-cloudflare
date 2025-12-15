import { Layout } from '../components/Layout';
import { BattleRulePage } from '../pages/BattleRulePage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Rules/BattleRulePage',
  component: BattleRulePage,
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
} satisfies Meta<typeof BattleRulePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};