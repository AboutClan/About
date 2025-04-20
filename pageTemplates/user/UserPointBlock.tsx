import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";

function UserPointBlock() {
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";
  const { data: userInfo } = useUserInfoQuery();
  const typeToast = useTypeToast();

  const handleGuestClick = (e) => {
    if (isGuest) {
      e.preventDefault();
      e.stopPropagation();
      typeToast("guest");
    }
  };

  return (
    <Flex
      mt={5}
      mx={5}
      p={3}
      justify="space-around"
      borderRadius="20px"
      border="var(--border-main)"
      bgColor="white"
    >
      <Link href="/user/ticket/gather" onClick={handleGuestClick} style={{ flex: 1 }}>
        <Flex direction="column" align="center">
          <Flex
            justify="center"
            align="center"
            w="48px"
            h="48px"
            bg="rgba(160,174,192,0.08)"
            borderRadius="50%"
          >
            <Image src="/ticket1.png" alt="ticket1" width={32} height={32} />
          </Flex>
          <Box mt={2} fontSize="16px" fontWeight="bold">
            {userInfo?.ticket.gatherTicket || 0}
          </Box>
          <Box fontWeight="medium" fontSize="10px" color="var(--gray-500)" lineHeight="12px">
            번개 참여권
          </Box>
        </Flex>
      </Link>
      <Link href="/user/ticket/groupStudy" onClick={handleGuestClick} style={{ flex: 1 }}>
        <Flex direction="column" align="center">
          <Flex
            justify="center"
            align="center"
            w="48px"
            h="48px"
            bg="rgba(107,175,255,0.08)"
            borderRadius="50%"
          >
            <Image src="/ticket2.png" alt="ticket2" width={32} height={32} />
          </Flex>
          <Box mt={2} fontSize="16px" fontWeight="bold">
            {userInfo?.ticket.groupStudyTicket || 0}
          </Box>
          <Box fontWeight="medium" fontSize="10px" color="var(--gray-500)" lineHeight="12px">
            소모임 참여권
          </Box>
        </Flex>
      </Link>
      <Link href="/store" onClick={handleGuestClick} style={{ flex: 1 }}>
        <Flex direction="column" align="center">
          <Flex
            justify="center"
            align="center"
            w="48px"
            h="48px"
            bg="rgba(0,194,179,0.08)"
            borderRadius="50%"
          >
            <Image src="/point.png" alt="ticket2" width={32} height={32} />
          </Flex>
          <Box mt={2} fontSize="16px" fontWeight="bold">
            {userInfo?.point || 0}P
          </Box>
          <Box fontWeight="medium" fontSize="10px" color="var(--gray-500)" lineHeight="12px">
            포인트
          </Box>
        </Flex>
      </Link>
    </Flex>
  );
}

export default UserPointBlock;
