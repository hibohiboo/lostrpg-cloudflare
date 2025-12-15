import { Layout } from '../components/Layout';
import { HeroSkillPage } from '../pages/HeroSkillPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Rules/HeroSkillPage',
  component: HeroSkillPage,
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
} satisfies Meta<typeof HeroSkillPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};