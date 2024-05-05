import type { Meta, StoryObj } from "@storybook/react";

import { ArrowBackButtonUI } from "../../../components/atoms/buttons/ArrowBackButton";

const meta = {
  title: "ATOMS/Button/ArrowBackButton",
  component: ArrowBackButtonUI,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},

  args: {},
} satisfies Meta<typeof ArrowBackButtonUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onClick: () => {},
  },
};
