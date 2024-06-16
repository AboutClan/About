import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import styled from "styled-components";

import { useUserInfoQuery } from "../../hooks/user/queries";

function UserPointBlock() {
  const { data: userInfo } = useUserInfoQuery();

  return (
    <Flex
      m="16px"
      p="16px 8px"
      pb="8px"
      justify="space-around"
      borderRadius="var(--rounded-lg)"
      border="var(--border-main)"
      bgColor="white"
    >
      <Button>
        <Link href="/user/score" style={{ width: "100%" }}>
          <Box mb="12px" color="var(--color-red)">
            <i className="fa-solid fa-star fa-xl" />
          </Box>
          <Box fontSize="15px" fontWeight={600}>
            {userInfo?.score}원
          </Box>
          <Box fontSize="13px" color="var(--gray-600)">
            동아리 점수
          </Box>
        </Link>
      </Button>
      <Button>
        <Link href="/user/point" style={{ width: "100%" }}>
          <Box mb="12px" color="var(--color-orange)">
            <i className="fa-solid fa-coins fa-xl" />
          </Box>
          <Box fontSize="15px" fontWeight={600}>
            {userInfo?.point}원
          </Box>
          <Box fontSize="13px" color="var(--gray-600)">
            포인트
          </Box>
        </Link>
      </Button>
      <Button isLast>
        <Link href="/user/deposit" style={{ width: "100%" }}>
          <Box mb="12px" color="var(--color-blue)">
            <i className="fa-solid fa-sack-dollar fa-xl" />
          </Box>
          <Box fontSize="15px" fontWeight={600}>
            {userInfo?.deposit}원
          </Box>
          <Box fontSize="13px" color="var(--gray-600)">
            보증금
          </Box>
        </Link>
      </Button>
    </Flex>
  );
}

const Button = styled.button<{ isLast?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: ${(props) => (props?.isLast ? "none" : "var(--border-main)")};
`;

export default UserPointBlock;
