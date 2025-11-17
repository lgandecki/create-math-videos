import type { Meta, StoryObj } from "@storybook/react-vite";

import { ManualSorter } from "./ManualSorter";

const meta = {
  component: ManualSorter,
} satisfies Meta<typeof ManualSorter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: {
      "Item 1": "1",
      "Item 2": "2",
      "Item 3": "3",
    },
  },
};
