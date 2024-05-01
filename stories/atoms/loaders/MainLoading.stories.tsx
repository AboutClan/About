import type { Meta, StoryObj } from "@storybook/react";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";

const meta = {
  title: "Atoms/Loaders/MainLoading",
  component: MainLoading,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},

  args: {},
} satisfies Meta<typeof MainLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
