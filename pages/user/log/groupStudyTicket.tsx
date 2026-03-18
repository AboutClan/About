/* eslint-disable */

import { Box, Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useState } from "react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGroupsMineQuery } from "../../../hooks/groupStudy/queries";
import { usePointSystemMutation, useUserTicketMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import UserSocialGuideDrawer2 from "../../../pageTemplates/user/UserSocialGuideDrawer2";

function GroupStudyTicketLogSection() {
  const toast = useToast();
  const { data: userInfo, refetch: refetch2 } = useUserInfoQuery();

  const { data } = useGroupsMineQuery("pending");

  const [isModal, setIsModal] = useState(false);
  const [isDrawer, setIsDrawer] = useState(false);

  const { mutate: updatePoint } = usePointSystemMutation("point");
  const { mutate, isLoading } = useUserTicketMutation({
    onSuccess() {
      toast("success", "티켓이 추가되었습니다.");
      setIsModal(false);
      // refetch();
      refetch2();
    },
  });
  const handleBuyTicket = () => {
    if (userInfo?.point < 7000) {
      toast("info", "구매 후 5,000 Point 이상의 잔액이 남아야 합니다.");
      return;
    }
    mutate({ ticketNum: 1, type: "gather" });
    updatePoint({
      value: -2000,
      message: "번개 참여권 구매",
      sub: "ticket",
    });
  };

  const sum = data?.slice()?.reduce((acc, cur) => {
    return acc + (cur.isMember ? 0 : cur.requiredTicket);
  }, 0);

  return (
    <>
      <Header title="소모임 참여권" />
      <Slide isNoPadding>
        <Box mt="56px">
          <Flex px={5} justify="space-between" align="center">
            <Box py={4}>
              <Box fontSize="11px">매월 받는 참여권</Box>
              <Box fontSize="20px" fontWeight="semibold">
                {userInfo?.ticket?.groupStudyTicket}개
              </Box>
            </Box>

            <Button
              colorScheme="mint"
              size="md"
              onClick={() => {
                setIsDrawer(true);
              }}
            >
              참여권 정보 확인
            </Button>
          </Flex>
          <Flex flexDir="column" mt={2} mx={5} mb={20}>
            <Box
              borderWidth="1px"
              borderColor="gray.300"
              borderRadius="2xl"
              boxShadow="md"
              overflow="hidden"
            >
              <Box px={4} py={3} borderBottomWidth="1px" borderColor="gray.300">
                <Text fontSize="12px" color="mint" fontWeight={600}>
                  정규 멤버는 참여권이 소모되지 않습니다.
                </Text>
              </Box>

              <Box p={3} py={2}>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th px={1} pb={2}>
                        <Text textAlign="start" color="gray.500" fontSize="11px">
                          이름
                        </Text>
                      </Th>
                      <Th px={1} pb={2}>
                        <Text textAlign="center" color="gray.500" fontSize="11px">
                          멤버
                        </Text>
                      </Th>
                      <Th px={0} pb={2}>
                        <Text textAlign="center" color="gray.500" fontSize="11px">
                          소모
                        </Text>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody color="gray.600">
                    {data?.map((it, idx) => (
                      <Tr key={idx} w="full">
                        <Td px={1} py={3} fontSize="12px" color="gray.700" maxW="210px" pr={2}>
                          <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                            {it.title}
                          </Text>
                        </Td>
                        <Td fontSize="12px" px={1} color="gray.600">
                          <Text textAlign="center">{it.isMember ? "정규" : "임시"}</Text>
                        </Td>
                        <Td fontSize="12px" px={0} color="gray.600" fontWeight={600}>
                          <Text textAlign="center">{it.isMember ? 0 : it.requiredTicket}장</Text>
                        </Td>
                      </Tr>
                    ))}
                    <Tr w="full">
                      <Td px={1} py={3} fontSize="12px" color="mint" maxW="210px" pr={2}>
                        <Text
                          overflow="hidden"
                          whiteSpace="nowrap"
                          fontWeight={600}
                          textOverflow="ellipsis"
                        >
                          월간 소모 참여권 합계
                        </Text>
                      </Td>
                      <Td fontSize="12px" px={1} color="gray.600">
                        <Text textAlign="center"></Text>
                      </Td>
                      <Td fontSize="12px" px={0} color="mint" fontWeight={600}>
                        <Text textAlign="center">{sum}장</Text>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>{" "}
                <Box px={1} py={3} pb={1}>
                  <Text fontSize="12px" color="gray.600">
                    참여권이 부족한 경우{" "}
                    <b style={{ color: "var(--color-red)" }}>티켓 수 x 1,000 Point</b>가 차감됩니다.
                  </Text>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Slide>
      {isDrawer && <UserSocialGuideDrawer2 onClose={() => setIsDrawer(false)} />}
    </>
  );
}

export default GroupStudyTicketLogSection;
