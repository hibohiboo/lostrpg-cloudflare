import { Layout } from '../components/Layout';
import { ArtifactClassPage } from '../pages/ArtifactClassPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Classes/ArtifactClassPage',
  component: ArtifactClassPage,
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
} satisfies Meta<typeof ArtifactClassPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};