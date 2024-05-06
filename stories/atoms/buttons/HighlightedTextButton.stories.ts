import type { Meta, StoryObj } from "@storybook/react";

import HighlightedTextButton from "../../../components/atoms/buttons/HighlightedTextButton";

const meta = {
  title: "ATOMS/Button/HighlightedTextButton",
  component: HighlightedTextButton,
  tags: ["autodocs"],
} satisfies Meta<typeof HighlightedTextButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "테스트",
    onClick: () => {},
  },
};
