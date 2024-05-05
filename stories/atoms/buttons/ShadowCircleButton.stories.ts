import type { Meta, StoryObj } from "@storybook/react";

import ShadowCircleButton from "../../../components/atoms/buttons/ShadowCircleButton";

const meta = {
  title: "ATOMS/Button/ShadowCircleButton",
  component: ShadowCircleButton,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},

  args: {},
} satisfies Meta<typeof ShadowCircleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    buttonProps: {
      text: "테스트",
      color: "var(--color-mint)",
      shadow: "var(--color-mint-light)",
    },
    onClick: () => {},
  },
};
