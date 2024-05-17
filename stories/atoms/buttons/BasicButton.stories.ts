import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { BasicButton } from "../../../components/atoms/buttons/BasicButton";

const meta = {
  title: "ATOMS/Button/BasicButton",
  component: BasicButton,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
  },

  args: { onClick: fn() },
} satisfies Meta<typeof BasicButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
    label: "Button",
  },
};
