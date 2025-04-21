import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { getDateDiff } from "../../../utils/dateTimeUtils";
import Avatar from "../../atoms/Avatar";
import { AboutIcon } from "../../Icons/AboutIcon";

interface PostAuthorCardProps {
  createdAt: string;
  organizer: IUserSummary;
  isAdminOpen?: boolean;
  children?: React.ReactNode;
  // size: "sm" | "md";
}

function PostAuthorCard({ organizer, createdAt, children, isAdminOpen }: PostAuthorCardProps) {
  return (
    <Flex align="center" px={5} py={4} justify="space-between">
      <Flex align="center">
        {isAdminOpen ? <AboutIcon size="xs" /> : <Avatar user={organizer} size="sm1" />}
        <Box ml={2}>
          <Box fontSize="13px" fontWeight="bold" lineHeight="20px" mb={0.5}>
            {isAdminOpen ? "어바웃" : organizer.name}
          </Box>
          <Box fontSize="10px" fontWeight="ight" lineHeight="12px" color="gray.500">
            {getDateDiff(dayjs(createdAt))}
          </Box>
        </Box>
      </Flex>
      <Box>{children}</Box>
    </Flex>
  );
}

export default PostAuthorCard;
