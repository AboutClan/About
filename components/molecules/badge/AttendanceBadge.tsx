import { Box, Flex } from "@chakra-ui/react";

import { CheckCircleIcon, XCircleIcon } from "../../Icons/CircleIcons";

interface IAttendanceBadge {
  type: "attend" | "dismissed";
  time?: string;
}

export default function AttendanceBadge({ type, time }: IAttendanceBadge) {
  return (
    <Box my={1}>
      <Flex
        mb={1}
        align="center"
        w="56px"
        h="24px"
        px="10px"
        py={1}
        borderRadius="8px"
        color="white"
        bg={type === "attend" ? "mint" : "red"}
      >
        {type === "attend" ? <CheckCircleIcon /> : <XCircleIcon />}
        <Box ml={1} fontSize="11px" lineHeight="16px" fontWeight="semibold">
          {type === "attend" ? "출석" : "불참"}
        </Box>
      </Flex>

      {time && (
        <Box fontSize="11px" lineHeight="12px" color="gray.500" textAlign="center">
          {time}
        </Box>
      )}
    </Box>
  );
}
