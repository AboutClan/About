import type { Meta, StoryObj } from "@storybook/react";

import ArrowTextButton from "../../../components/atoms/buttons/ArrowTextButton";

const meta = {
  title: "ATOMS/Button/ArrowTextButton",
  component: ArrowTextButton,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},

  args: {},
} satisfies Meta<typeof ArrowTextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    dir: "right",
    text: "BUTTON",
    size: "md",
  },
};
export const Secondary: Story = {
  args: {
    dir: "left",
    text: "BUTTON",
    size: "md",
  },
};
