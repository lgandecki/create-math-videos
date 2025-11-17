import type { Meta, StoryObj } from "@storybook/react-vite";

import { EarthquakeWrapper } from "./EarthquakeWrapper";

const meta = {
  component: EarthquakeWrapper,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    magnitude: {
      control: {
        type: "range",
        min: 1,
        max: 10,
        step: 0.1,
      },
      description: "Earthquake magnitude on the Richter scale",
    },
  },
} satisfies Meta<typeof EarthquakeWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    magnitude: 6,
  },
};

export const MinorEarthquake: Story = {
  args: {
    magnitude: 3.5,
  },
};

export const ModerateEarthquake: Story = {
  args: {
    magnitude: 7.2,
  },
};

export const CatastrophicEarthquake: Story = {
  args: {
    magnitude: 10,
  },
};
