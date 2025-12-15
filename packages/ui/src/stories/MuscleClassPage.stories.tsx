import { Layout } from '../components/Layout';
import { MuscleClassPage } from '../pages/MuscleClassPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Classes/MuscleClassPage',
  component: MuscleClassPage,
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
} satisfies Meta<typeof MuscleClassPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};