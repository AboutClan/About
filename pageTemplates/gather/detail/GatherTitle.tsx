import { Badge, Box, Flex } from "@chakra-ui/react";

import MainBadge from "../../../components/atoms/MainBadge";
import { GatherCategory } from "../../../types/models/gatherTypes/gatherTypes";

interface IGatherTitle {
  title: string;
  category: string;
  type: GatherCategory;
  age: number[];
  isFree: boolean;
}

function GatherTitle({ title, category, type, age, isFree }: IGatherTitle) {
  const isDefault = age[0] === 19 && age[1] === 28;

  return (
    <Flex flexDir="column" px={5} pt={4} pb={0}>
      <Flex mb={2}>
        <Box mr={1}>
          <MainBadge
            text={type === "event" ? "이벤트" : type === "official" ? "공식 행사" : category}
          />
        </Box>
        <MainBadge text={isFree ? "자유 가입" : "승인제"} type="sub" />
        {!isDefault && (
          <Badge
            px={2}
            py={1}
            fontSize="10px"
            fontWeight={400}
            borderRadius="4px"
            ml={1}
            size="md"
            variant="subtle"
            bg="blue.50"
            color="blue.500"
          >
            만 {age[0]} ~ {age[1]}세
          </Badge>
        )}
      </Flex>
      <Box mb={2} fontSize="16px" fontWeight="bold" lineHeight="28px">
        {title}
      </Box>
    </Flex>
  );
}

export default GatherTitle;
