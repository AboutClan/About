import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import Header from "@/components/layouts/Header";
import Slide from "@/components/layouts/PageSlide";
import TabNav from "@/components/molecules/navs/TabNav";
import UserApprovalBoard from "@/components/organisms/boards/UserApprovalBoard";
import UserDeleteBoard from "@/components/organisms/boards/UserDeleteBoard";
import ParentApplicantInviteBoard from "@/features/gather/components/ParentApplicantInviteBoard";
import RegularConfirmBoard from "@/features/gather/components/RegularConfirmBoard";
import UserInviteBoard from "@/features/gather/components/UserInviteBoard";
import {
  useGatherParticipationMutation,
  useGatherWaitingStatusMutation,
} from "@/features/gather/hooks/mutations";
import { useGatherIDQuery } from "@/features/gather/hooks/queries";
import { useResetGatherQuery } from "@/features/gather/hooks/useResetGatherQuery";
import { withRealName } from "@/features/gather/utils/memberDisplay";
import { useToast } from "@/hooks/custom/CustomToast";
import { IUser } from "@/types/models/userTypes/userInfoTypes";
import { getDisplayName } from "@/utils/stringUtils";
import { safeDecodeTel } from "@/utils/utils";

const TAB_ARR = ["신청 인원", "참여 인원", "인원 초대"] as const;
// 상시 행사는 신청을 구글폼으로 받고 참여는 확정 모임에서 하므로 확정 모임 만들기만 둔다
const REGULAR_TAB_ARR = ["확정 모임"] as const;
// 상시 행사에서 만든 확정 모임은 상위 행사 신청자를 바로 초대할 수 있게 한다
const CONFIRMED_TAB_ARR = ["상시 행사 신청자", "참여 인원", "인원 초대"] as const;

const withRealNameUser = (user: IUser) => {
  const displayName = withRealName(getDisplayName(user), user?.name);
  return { ...user, name: displayName, nickname: displayName };
};

type Tab =
  (typeof TAB_ARR)[number] | (typeof REGULAR_TAB_ARR)[number] | (typeof CONFIRMED_TAB_ARR)[number];

function Admin() {
  const router = useRouter();
  const toast = useToast();
  const resetQuery = useResetGatherQuery();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const [tab, setTab] = useState<Tab>("신청 인원");

  const { data: gatherData } = useGatherIDQuery(+id, {
    enabled: !!id,
  });

  const isRegularGather = gatherData?.category === "regularGather";
  const tabs: readonly Tab[] = isRegularGather
    ? REGULAR_TAB_ARR
    : gatherData?.parentGatherId
      ? CONFIRMED_TAB_ARR
      : TAB_ARR;
  const currentTab: Tab = tabs.includes(tab) ? tab : tabs[0];

  const { mutate } = useGatherWaitingStatusMutation(+id, {
    onSuccess() {
      resetQuery();
    },
    onError() {
      toast("error", "요청을 처리하지 못했습니다. 다시 시도해주세요.");
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
          tabOptionsArr={tabs.map((tab) => ({
            text: tab,
            func: () => setTab(tab),
          }))}
          selected={currentTab}
          isFullSize
          isBlack
        />
        <Box h={5} />
        {gatherData &&
          (currentTab === "확정 모임" ? (
            <RegularConfirmBoard gather={gatherData} />
          ) : currentTab === "상시 행사 신청자" ? (
            <ParentApplicantInviteBoard gather={gatherData} />
          ) : currentTab === "신청 인원" ? (
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
          ) : currentTab === "참여 인원" ? (
            <Box px={5}>
              <UserDeleteBoard
                users={gatherData.participants.map((who) =>
                  who.isDummy
                    ? {
                        user: who.user as IUser,
                        text: "더미 멤버",
                        deleteId: who.dummyId,
                      }
                    : {
                        // 관리자 페이지(모임장·운영진만 진입)라 "닉네임 (실명)"으로 보여 준다
                        user: withRealNameUser(who.user as IUser),
                        text:
                          safeDecodeTel((who?.user as IUser)?.telephone) ||
                          ((who?.user as IUser)?.telephone?.toString() ?? "없음"),
                        deleteId: (who.user as IUser)?._id,
                      },
                )}
                handleDelete={(userId) => deleteUser({ userId })}
              />
            </Box>
          ) : (
            <UserInviteBoard
              gatherId={gatherData.id + ""}
              groupId={gatherData?.groupId}
              members={gatherData.participants
                .filter((who) => !who.isDummy)
                .map((who) => who.user._id)}
            />
          ))}
      </Slide>
    </>
  );
}

export default Admin;

import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

const GATHER_ADMIN_UIDS = ["2259633694", "3224546232"];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const id = context.params?.id;
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

  try {
    const res = await fetch(`${SERVER_URI}/gather?gatherId=${id}`);
    if (res.ok) {
      const gather = await res.json();
      const ownerId = typeof gather?.user === "string" ? gather.user : gather?.user?._id;
      const isOwner = ownerId === session.user.id;
      const isSuperAdmin =
        GATHER_ADMIN_UIDS.includes(session.user.uid) || session.user.role === "previliged";

      if (!isOwner && !isSuperAdmin) {
        return { redirect: { destination: "/home", permanent: false } };
      }
    }
  } catch {}

  return { props: {} };
};
