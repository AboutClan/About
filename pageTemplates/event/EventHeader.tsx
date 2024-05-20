import { Box, Flex } from "@chakra-ui/react";
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
            <i className="fa-solid fa-circle-p fa-lg" style={{ color: "var(--color-mint)" }} />
          </Box>
          {userInfo?.point || 0} P
        </Flex>
      </Link>
    </Header>
  );
}
