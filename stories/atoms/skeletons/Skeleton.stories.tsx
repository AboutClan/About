import type { Meta, StoryObj } from "@storybook/react";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

const meta = {
  title: "Atoms/skeleton/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "I'm Skeleton's children",
  },
};
