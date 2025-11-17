import type { Meta, StoryObj } from "@storybook/react-vite";
import PerfectOrangeJuice from "./PerfectOrangeJuice";

const meta = {
  component: PerfectOrangeJuice,
} satisfies Meta<typeof PerfectOrangeJuice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  argTypes: {
    concentrate: { control: "number" },
    units: { control: "text" },
    proportion: { control: "text" },
  },
  args: {
    concentrate: 200,
    units: "ml",
    proportion: "1:3",
    onComplete: (result: { isCorrect: boolean; water: number }) => {
      console.log("Completed:", result);
    },
  },
};
