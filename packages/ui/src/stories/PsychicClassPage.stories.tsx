import { Layout } from '../components/Layout';
import { PsychicClassPage } from '../pages/PsychicClassPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Classes/PsychicClassPage',
  component: PsychicClassPage,
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
} satisfies Meta<typeof PsychicClassPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};