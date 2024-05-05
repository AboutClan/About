import type { Meta, StoryObj } from "@storybook/react";

import ShadowBlockButton from "../../../components/atoms/buttons/ShadowBlockButton";

const meta = {
  title: "ATOMS/Button/ShadowBlockButton",
  component: ShadowBlockButton,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},

  args: {},
} satisfies Meta<typeof ShadowBlockButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "테스트",
  },
};
