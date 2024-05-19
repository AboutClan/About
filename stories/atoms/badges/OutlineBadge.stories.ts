import type { Meta } from "@storybook/react";

import OutlineBadge from "../../../components/atoms/badges/OutlineBadge";

const meta = {
  title: "Atoms/Badge/OutlineBadge",
  component: OutlineBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof OutlineBadge>;

export default meta;

export const Primary = {
  args: {},
};

export const PrimarySizeSmall = {
  args: {
    ...Primary.args,
    size: "sm",
  },
};
