import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import TabNav from "../../../components/molecules/navs/TabNav";
import UserApprovalBoard from "../../../components/organisms/boards/UserApprovalBoard";
import UserDeleteBoard from "../../../components/organisms/boards/UserDeleteBoard";
import UserInviteBoard from "../../../components/organisms/boards/UserInviteBoard";
import { useResetGatherQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import {
  useGatherParticipationMutation,
  useGatherWaitingStatusMutation,
} from "../../../hooks/gather/mutations";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { safeDecodeTel } from "../../../utils/utils";

const TAB_ARR = ["신청 인원", "참여 인원", "인원 초대"] as const;

type Tab = (typeof TAB_ARR)[number];

function Admin() {
  const router = useRouter();
  const toast = useToast();
  const resetQuery = useResetGatherQuery();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const [tab, setTab] = useState<Tab>("신청 인원");

  const { data: gatherData } = useGatherIDQuery(+id, {
    enabled: !!id,
  });

  const { mutate } = useGatherWaitingStatusMutation(+id, {
    onSuccess() {
      resetQuery();
    },
    onError() {
      toast("error", "상대가 보유중인 참여권이 없습니다.");
      resetQuery();
    },
  });

  const { mutate: deleteUser } = useGatherParticipationMutation("delete", +id, {
    onSuccess() {
      resetQuery();
    },
  });

  const handleUserStatus = async (userId: string, status: "agree" | "refuse") => {
    await mutate({ userId, status, text: null });

    if (status === "agree") toast("success", "승인되었습니다.");
    else if (status === "refuse") toast("success", "거절했습니다.");
  };

  return (
    <>
      <Header title="관리자 페이지" />
      <Slide isNoPadding>
        <TabNav
          tabOptionsArr={TAB_ARR.map((tab) => ({
            text: tab,
            func: () => setTab(tab),
          }))}
          selected={tab}
          isFullSize
          isBlack
        />
        <Box h={5} />
        {gatherData &&
          (tab === "신청 인원" ? (
            gatherData?.waiting?.length ? (
              <UserApprovalBoard
                users={gatherData.waiting.map((who) => ({
                  user: who.user,
                  text: who.phase === "first" ? "1차 참여" : "2차 참여",
                }))}
                handleApprove={(userId) => handleUserStatus(userId, "agree")}
                handleRefuse={(userId) => handleUserStatus(userId, "refuse")}
              />
            ) : (
              <Flex
                justify="center"
                align="center"
                fontSize="14px"
                fontWeight="medium"
                bg="gray.100"
                px={3}
                py={4}
                minH="114px"
                borderRadius="8px"
                color="gray.600"
                border="var(--border)"
              >
                현재 신청중인 인원이 없습니다.
              </Flex>
            )
          ) : tab === "참여 인원" ? (
            <Box px={5}>
              <UserDeleteBoard
                users={gatherData.participants.map((who) => ({
                  user: who.user,
                  text:
                    safeDecodeTel((who?.user as IUser)?.telephone) ||
                    ((who?.user as IUser)?.telephone?.toString() ?? "없음"),
                }))}
                handleDelete={(userId) => deleteUser({ userId })}
              />
            </Box>
          ) : (
            <UserInviteBoard
              gatherId={gatherData.id + ""}
              groupId={gatherData?.groupId}
              members={gatherData.participants.map((who) => who.user._id)}
            />
          ))}
      </Slide>
    </>
  );
}

export default Admin;
