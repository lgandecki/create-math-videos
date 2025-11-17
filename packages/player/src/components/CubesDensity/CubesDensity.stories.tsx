// @ts-nocheck - TODO: fix this
import type { Meta, StoryObj } from "@storybook/react";
import CubesDensity from "./CubesDensity";

const meta: Meta<typeof CubesDensity> = {
  title: "Components/CubesDensity",
  component: CubesDensity,
  argTypes: {
    side: {
      control: { type: "number", min: 1, max: 20, step: 1 },
      description: "Side length of the cube in cm",
    },
    density: {
      control: { type: "number", min: 0.01, max: 20, step: 0.01 },
      description: "Density of the material in g/cm³",
    },
    units: {
      control: { type: "text" },
      description: "Units for density",
    },
    cubeType: {
      control: { type: "select" },
      options: ["steel", "styrofoam"],
      description: "Type of cube material",
    },
    tolerance: {
      control: { type: "number", min: 1, max: 1000, step: 1 },
      description: "Tolerance for correct answer in grams",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CubesDensity>;

export const SteelCube: Story = {
  args: {
    side: 10,
    density: 7.8,
    units: "g/cm³",
    cubeType: "steel",
    tolerance: 100,
  },
};

export const StyrofoamCube: Story = {
  args: {
    side: 10,
    density: 0.05,
    units: "g/cm³",
    cubeType: "styrofoam",
    tolerance: 5,
  },
};
