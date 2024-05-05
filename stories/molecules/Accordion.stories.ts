import type { Meta, StoryObj } from "@storybook/react";

import Accordion from "../../components/molecules/Accordion";
import { ACCORDION_CONTENT_FEE } from "../../constants/contentsText/accordionContents";

const meta = {
  title: "ATOMS/molecules/Accordion",
  component: Accordion,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {},

  args: {},
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    contentArr: ACCORDION_CONTENT_FEE,
  },
};
