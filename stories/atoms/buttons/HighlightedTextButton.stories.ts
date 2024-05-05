import type { Meta, StoryObj } from "@storybook/react";

import HighlightedTextButton from "../../../components/atoms/buttons/HighlightedTextButton";

const meta = {
  title: "ATOMS/Button/HighlightedTextButton",
  component: HighlightedTextButton,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},

  args: {},
} satisfies Meta<typeof HighlightedTextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "테스트",
    onClick: () => {},
  },
};
