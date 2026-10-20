import { Box, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import Avatar from "@/components/atoms/Avatar";
import BottomNavButton from "@/components/atoms/BottomNavButton";
import { MainLoadingAbsolute } from "@/components/atoms/loaders/MainLoading";
import Header from "@/components/layouts/Header";
import Slide from "@/components/layouts/PageSlide";
import { ModalLayout } from "@/components/modals/Modals";
import BlurredPart from "@/components/molecules/BlurredPart";
import { GROUP_STUDY } from "@/constants/keys/queryKeys";
import { useGroupEvaluationMutation } from "@/features/group/hooks/mutations";
import { useGroupEvaluationQuery } from "@/features/group/hooks/queries";
import { MemberReviewRow } from "@/features/user/components/MemberReviewRow";
import { UserRating } from "@/features/user/hooks/mutations";
import { useToast } from "@/hooks/custom/CustomToast";
import { useUserInfo } from "@/hooks/custom/UserHooks";

export default function GroupEvaluationScreen() {
  const toast = useToast();
  const router = useRouter();
  const id = router.query?.id as string;
  const userInfo = useUserInfo();
  const queryClient = useQueryClient();

  const { data } = useGroupEvaluationQuery(id, { enabled: !!id });

  const [ratings, setRatings] = useState<Record<string, UserRating>>({});
  const [isDeniedModal, setIsDeniedModal] = useState(false);

  // 기간 안에 이미 준 평가가 있으면 기본 선택
  useEffect(() => {
    if (!data) return;
    setRatings(data.myRatings ?? {});
    if (!data.canVote) setIsDeniedModal(true);
  }, [data]);

  const { mutate, isLoading } = useGroupEvaluationMutation(id, {
    onSuccess() {
      queryClient.invalidateQueries([GROUP_STUDY]);
      toast("success", "멤버 평가가 완료되었습니다.");
    },
    onError(error) {
      const message = (error.response?.data as { message?: string })?.message;
      toast("error", message || "평가 제출에 실패했습니다.");
    },
  });

  const startText = data ? dayjs(data.start).format("M월 D일") : "";
  const deniedMessage = `전달(${startText})부터 현재까지 소모임 모임 참여 기록이 있는 멤버만 투표할 수 있어요.`;

  const members = (data?.members ?? []).filter(
    (user) => user.uid !== userInfo?.uid && user.uid !== "3224546232",
  );

  const handleSubmit = () => {
    if (!data?.canVote) {
      setIsDeniedModal(true);
      return;
    }
    const infos = members
      .filter((user) => ratings[user.uid])
      .map((user) => ({ toUid: user.uid, rating: ratings[user.uid] }));
    if (!infos.length) {
      toast("warning", "평가를 1명 이상 선택해 주세요.");
      return;
    }
    mutate({ infos });
  };

  return (
    <>
      <Header title="월간 멤버 평가" />
      {data ? (
        <Slide isNoPadding>
          <Box mx={5} mt={4}>
            <Box fontSize="18px" fontWeight="bold">
              평가 참여 현황
            </Box>
            <Box fontSize="12px" color="gray.500">
              아래는 1회 이상 모임에 참여하여 이번 달 투표 권한이 있는 멤버입니다.
            </Box>
          </Box>
          <Grid mt={3} px={5} templateColumns="repeat(5, 1fr)" rowGap={3} columnGap={2}>
            {data.eligible.map(({ user, submitted }) => (
              <Flex key={user.uid} direction="column" align="center" minW={0}>
                <Avatar user={user} size="sm1" isLink={false} />
                <Box mt={1} fontSize="11px" fontWeight="semibold" noOfLines={1} maxW="full">
                  {user.name}
                </Box>
                <Flex mt={0.5} h="16px" align="center">
                  {submitted ? (
                    <SubmittedIcon />
                  ) : (
                    <Box fontSize="10px" color="gray.400">
                      미참여
                    </Box>
                  )}
                </Flex>
              </Flex>
            ))}
          </Grid>

          <Box h={2} bg="gray.100" my={5} />

          <Box fontSize="18px" fontWeight="bold" mx={5}>
            <Box>멤버 리뷰</Box>
            <Box fontSize="12px" color="gray.500" fontWeight={400}>
              익명 보장! 솔직한 평가를 남겨주세요!
            </Box>
          </Box>

          <Box mb={10} mx={5}>
            <BlurredPart isBlur={!data.canVote} text="투표 권한이 있는 멤버만 평가할 수 있어요">
              {members.map((user) => (
                <MemberReviewRow
                  key={user.uid}
                  user={user}
                  myRating={ratings[user.uid] ?? null}
                  onChangeRating={(rating) => {
                    // 권한이 없으면 선택 자체를 막고 안내 팝업만 띄운다
                    if (!data.canVote) {
                      setIsDeniedModal(true);
                      return;
                    }
                    setRatings((prev) => {
                      const next = { ...prev };
                      // PASS 또는 같은 평가를 다시 누르면 해제
                      if (!rating || prev[user.uid] === rating) delete next[user.uid];
                      else next[user.uid] = rating;
                      return next;
                    });
                  }}
                  onChangeMessage={() => {}}
                />
              ))}
            </BlurredPart>
          </Box>
          <BottomNavButton
            text={data.canVote ? "멤버 평가 완료" : "투표 권한이 없어요"}
            color="black"
            func={handleSubmit}
            isLoading={isLoading}
          />
        </Slide>
      ) : (
        <MainLoadingAbsolute />
      )}
      {isDeniedModal && (
        <ModalLayout
          title="투표 권한 없음"
          setIsModal={() => setIsDeniedModal(false)}
          footerOptions={{ main: {} }}
        >
          {deniedMessage}
        </ModalLayout>
      )}
    </>
  );
}

// 월간 출석 화면(pages/group/[id]/month.tsx)과 같은 아이콘
function SubmittedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-mint)"
    >
      <path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}
