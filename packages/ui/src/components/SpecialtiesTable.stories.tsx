import { SpecialtiesTable } from './SpecialtiesTable';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof SpecialtiesTable> = {
  title: 'LOST/SpecialtiesTable',
  component: SpecialtiesTable,
  parameters: {
    layout: 'padded',
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
