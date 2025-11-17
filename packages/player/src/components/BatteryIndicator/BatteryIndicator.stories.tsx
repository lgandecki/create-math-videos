import type { Meta, StoryObj } from "@storybook/react-vite";

import BatteryIndicator from "./BatteryIndicator";

const meta = {
  component: BatteryIndicator,
} satisfies Meta<typeof BatteryIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // @ts-expect-error - TODO: fix this
  args: {
    expectedBatteryLevel: 55,
    onBatteryLevelSet: (level: number) => {
      console.log("Battery level set to:", level);
    },
  },
};
