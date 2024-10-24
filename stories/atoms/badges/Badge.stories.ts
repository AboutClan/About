import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "../../../components/atoms/badges/Badges";

const meta = {
  title: "Atoms/Badge/Badge",
  component: Badge,
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    colorScheme: "mint",
    text: "Button",
  },
};

export const Secondary: Story = {
  args: {
    colorScheme: "yellow",
    text: "Button",
  },
};
export const Test: Story = {
  args: {
    colorScheme: "red",
    text: "Button",
  },
};
