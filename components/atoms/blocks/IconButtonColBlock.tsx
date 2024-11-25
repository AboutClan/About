import { Badge, Box, Button, Flex } from "@chakra-ui/react";

import { BADGE_COLOR_MAPPINGS } from "../../../constants/serviceConstants/badgeConstants";

export interface IIconButtonColBlockProps {
  icon: React.ReactNode;
  title: string;
  buttonProp: {
    text: string;
    func: () => void;
  };
  disabled: boolean;
}
interface IIconButtonColBlock {
  props: IIconButtonColBlockProps;
}
export default function IconButtonColBlock({
  props: {
    icon,
    title,
    buttonProp: { text, func },
    disabled,
  },
}: IIconButtonColBlock) {
  return (
    <Flex p="12px" rounded="lg" bgColor="var(--gray-200)" direction="column" align="center">
      <Box fontSize="36px">{icon}</Box>

      <Badge variant="subtle" fontSize="14px" mb="16px" colorScheme={BADGE_COLOR_MAPPINGS[title]}>
        {title}
      </Badge>

      <Button
        size="sm"
        w="100%"
        rounded="lg"
        colorScheme={!disabled ? "mint" : "blackAlpha"}
        disabled={disabled}
        onClick={func}
      >
        {text}
      </Button>
    </Flex>
  );
}
