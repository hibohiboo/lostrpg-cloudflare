import { Layout } from '../components/Layout';
import { AcclaimRulePage } from '../pages/AcclaimRulePage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Rules/AcclaimRulePage',
  component: AcclaimRulePage,
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
} satisfies Meta<typeof AcclaimRulePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
