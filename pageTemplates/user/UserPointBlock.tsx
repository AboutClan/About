import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import InstagramCheckModal from "../../modals/InstagramCheckModal";
import { BarRightIcon } from "./UserScoreBar";

function UserPointBlock({ handleButton }: { handleButton: () => void }) {
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";
  const { data: userInfo } = useUserInfoQuery();
  const typeToast = useTypeToast();

  const [isModal, setIsModal] = useState(false);

  const handleGuestClick = (e) => {
    if (isGuest) {
      e.preventDefault();
      e.stopPropagation();
      typeToast("guest");
    }
  };

  return (
    <>
      <Box
        mt={1}
        ml={5}
        mr={5}
        p={3}
        pr={0}
        pb={1}
        borderRadius="20px"
        border="var(--border)"
        bgColor="white"
      >
        <Flex mr={3} justify="space-around">
          <Link href="/user/log/gatherTicket" onClick={handleGuestClick} style={{ flex: 1 }}>
            <Flex direction="column" align="center">
              <Flex
                justify="center"
                align="center"
                w="48px"
                h="48px"
                bg="RGBA(173, 50, 82,0.08)"
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
          <Link href="/user/log/groupStudyTicket" onClick={handleGuestClick} style={{ flex: 1 }}>
            <Flex direction="column" align="center">
              <Flex
                justify="center"
                align="center"
                w="48px"
                h="48px"
                bg="RGBA(61, 111, 243,0.08)"
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
          <Link href="/user/log/point" onClick={handleGuestClick} style={{ flex: 1 }}>
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
        <Flex mt={2}>
          <Button
            pt={0.5}
            pb={1.5}
            px={2}
            variant="unstyled"
            color="var(--color-gray)"
            ml="auto"
            border="none"
            w="max-content"
            fontSize="10px"
            lineHeight="14px"
            rightIcon={
              <Flex
                transform="translateY(2.7px)"
                alignItems="center"
                justifyContent="center"
                h="14px"
              >
                <BarRightIcon />
              </Flex>
            }
            iconSpacing={0.5}
            onClick={() => {
              handleButton();
            }}
          >
            월간 참여권 가이드
          </Button>
        </Flex>
        {/* <Flex justify="space-around" mt={5}>
          <Box flex={1}>
            <Button variant="nostyle" p={0} h="auto" onClick={() => setIsModal(true)}>
              <Flex direction="column" align="center" flex={1}>
                <Flex
                  justify="center"
                  align="center"
                  w="48px"
                  h="48px"
                  bg="RGBA(227, 175, 56,0.08)"
                  borderRadius="50%"
                >
                  <Image src="/star.png" alt="ticket2" width={36} height={36} />
                </Flex>
                <Box mt={2} color="gray.600" fontSize="11px" fontWeight="medium">
                  인스타그램 출석체크
                </Box>
              </Flex>
            </Button>
          </Box>

          <Link href="/user/point/settlement" onClick={handleGuestClick} style={{ flex: 1 }}>
            <Flex direction="column" align="center">
              <Flex
                justify="center"
                align="center"
                w="48px"
                h="48px"
                bg="RGBA(227, 175, 56,0.08)"
                borderRadius="50%"
              >
                <Image src="/change.png" alt="ticket2" width={44} height={44} />
              </Flex>
              <Box mt={2} color="gray.600" fontSize="11px" fontWeight="medium">
                지원금 신청하기
              </Box>
            </Flex>
          </Link>
          <Link href="/user/point/charge" style={{ flex: 1 }}>
            <Flex direction="column" align="center">
              <Flex
                justify="center"
                align="center"
                w="48px"
                h="48px"
                bg="RGBA(227, 175, 56,0.08)"
                borderRadius="50%"
              >
                <Image src="/up.png" alt="ticket2" width={40} height={40} />
              </Flex>

              <Box mt={2} color="gray.600" fontSize="11px" fontWeight="medium">
                포인트 충전하기
              </Box>
            </Flex>
          </Link>
        </Flex> */}
      </Box>
      {isModal && <InstagramCheckModal setIsModal={setIsModal} />}
    </>
  );
}

export default UserPointBlock;
