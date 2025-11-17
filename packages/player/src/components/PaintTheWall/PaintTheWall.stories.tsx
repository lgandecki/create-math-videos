import type { Meta, StoryObj } from "@storybook/react";
import PaintTheWall from "./PaintTheWall";

const meta: Meta<typeof PaintTheWall> = {
  title: "Components/PaintTheWall",
  component: PaintTheWall,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    width: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Width of the wall (max 10 for good UX)",
    },
    height: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Height of the wall (max 10 for good UX)",
    },
    units: {
      control: { type: "text" },
      description: "Units for measurements",
    },
    tolerance: {
      control: { type: "number", min: 0, max: 5, step: 0.5 },
      description: "Tolerance for correct answer",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PaintTheWall>;

export const BeginnerWall: Story = {
  name: "🌟 Beginner (3×3)",
  args: {
    width: 3,
    height: 3,
    units: "m",
    tolerance: 1,
  },
};

export const IntermediateWall: Story = {
  name: "🎯 Intermediate (5×4)",
  args: {
    width: 5,
    height: 4,
    units: "m",
    tolerance: 1,
  },
};

export const AdvancedWall: Story = {
  name: "🚀 Advanced (6×6)",
  args: {
    width: 6,
    height: 6,
    units: "m",
    tolerance: 2,
  },
};

export const TinyWall: Story = {
  name: "👶 Tiny Wall (2×2)",
  args: {
    width: 2,
    height: 2,
    units: "m",
    tolerance: 0,
  },
};

export const LongWall: Story = {
  name: "📏 Long Wall (8×2)",
  args: {
    width: 8,
    height: 2,
    units: "m",
    tolerance: 1,
  },
};

export const WithCallback: Story = {
  name: "🔔 With Callback",
  args: {
    width: 4,
    height: 3,
    units: "m",
    tolerance: 1,
    onComplete: (result) => {
      console.log("Student answer:", result);
      alert(
        `🎨 ${result.isCorrect ? "Correct! 🎉" : "Try again! 💪"}\nStudent painted: ${result.studentAnswer} squares`
      );
    },
  },
};
