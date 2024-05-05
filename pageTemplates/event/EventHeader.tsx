import { Box, Flex } from "@chakra-ui/react";
import { faCircleP } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import Header from "../../components/layouts/Header";
import { useUserInfoQuery } from "../../hooks/user/queries";

export default function EventHeader() {
  const { data: userInfo } = useUserInfoQuery();

  return (
    <Header title="이벤트">
      <Link href="/user/point">
        <Flex fontWeight={600}>
          <Box mr="6px">
            <FontAwesomeIcon icon={faCircleP} color="var(--color-mint)" size="lg" />
          </Box>
          {userInfo?.point || 0} P
        </Flex>
      </Link>
    </Header>
  );
}
