import type { Meta, StoryObj } from "@storybook/react";

import AttendanceModal from "../../design/attendance/AttendanceModal";

const meta = {
  title: "DESIGNS/AttendanceModal",
  component: AttendanceModal,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof AttendanceModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: 1,
  },
};
export const Secondary: Story = {
  args: {
    type: 2,
  },
};
