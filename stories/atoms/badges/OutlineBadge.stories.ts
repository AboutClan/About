import type { Meta, StoryObj } from "@storybook/react";

import OutlineBadge from "../../../components/atoms/badges/OutlineBadge";

const meta = {
  title: "Atoms/Badge/OutlineBadge",
  component: OutlineBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof OutlineBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    colorScheme: "mintTheme",
    text: "OutlineBadge",
  },
};

export const PrimarySizeSmall: Story = {
  args: {
    ...Primary.args,
    size: "sm",
  },
};
