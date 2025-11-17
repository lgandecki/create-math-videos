import type { Meta, StoryObj } from "@storybook/react-vite";

import Counter from "./Counter";

const meta = {
  component: Counter,
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    expectedNumber: 0,
    onNumberSet: () => {},
  },
};
