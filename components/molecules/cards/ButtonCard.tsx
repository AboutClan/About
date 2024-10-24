import { Box, Button, Flex } from "@chakra-ui/react";

import { NoticeIcon } from "../../Icons/NoticeIcons";

export interface IButtonCardProps {
  title: string;
  subTitle: string;
  buttonText: string;
  func: () => void;
}

interface IButtonCard {
  props: IButtonCardProps;
}

export default function ButtonCard({ props: { title, subTitle, buttonText, func } }: IButtonCard) {
  return (
    <Flex onClick={func} p="12px 20px" justifyContent="space-between" align="center">
      <NoticeIcon type="main" />
      <Box ml="12px" flex={1}>
        <Box fontWeight={600} fontSize="14px">
          {title}
        </Box>
        <Box fontSize="14px">{subTitle}</Box>
      </Box>
      <Button colorScheme="mint" size="sm" w="64px">
        {buttonText}
      </Button>
    </Flex>
  );
}
