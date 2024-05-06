import { faLock } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Meta, StoryObj } from "@storybook/react";

import IconButtonColBlock from "../../../components/atoms/blocks/IconButtonColBlock";

const meta = {
  title: "Atoms/Blocks/IconButtonColBlock",
  component: IconButtonColBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof IconButtonColBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    props: {
      icon: <FontAwesomeIcon icon={faLock} color="var(--gray-3)" />,
      title: "I'm title prop",
      buttonProp: {
        text: "I'm Button's text prop",
        func: () => {},
      },
      disabled: false,
    },
  },
};

export const PrimaryDisabled: Story = {
  args: {
    ...Primary.args,
    props: {
      ...Primary.args.props,
      disabled: true,
    },
  },
};
