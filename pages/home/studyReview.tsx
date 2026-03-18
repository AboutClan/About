import { Box, Button, Flex, Grid, GridItem, Stack } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useRef, useState } from "react";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import Avatar from "../../components/atoms/Avatar";
import BottomNavButton from "../../components/atoms/BottomNavButton";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Textarea from "../../components/atoms/Textarea";
import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import ProfileCommentCard from "../../components/molecules/cards/ProfileCommentCard";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyPassedDayQuery } from "../../hooks/study/queries";
import {
  UserRating,
  UserReviewProps,
  useUserStudyReviewMutation,
} from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
/* ================= 아바타 관련 상수 & 컴포넌트 (컴포넌트 밖) ================= */

type AvatarOption = { type: number; text: string; rating: UserRating; bg: number };

const avatarArr: AvatarOption[] = [
  { type: 20, bg: 1, text: "최고에요😘", rating: "great" },
  { type: 11, bg: 6, text: "좋아요😉 ", rating: "good" },
  { type: 12, bg: 2, text: "그냥 그래요😑", rating: "soso" },
  { type: 28, bg: 0, text: "불편해요🫤", rating: "block" },
];

// 아바타 줄: rating이 바뀔 때만 리렌더되도록 memo + 커스텀 비교
type RatingAvatarRowProps = {
  myRating: UserRating | null;
  onChangeRating: (rating: UserRating) => void;
};

const RatingAvatarRow = memo(
  function RatingAvatarRow({ myRating, onChangeRating }: RatingAvatarRowProps) {
    return (
      <Flex justify="space-between">
        {avatarArr.map((props) => {
          const isChecked = myRating === props.rating;

          return (
            <Button
              key={props.rating}
              opacity={isChecked ? 1 : 0.5}
              w="72px"
              h="100px"
              variant="nostyle"
              display="flex"
              flexDir="column"
              onClick={() => onChangeRating(props.rating)}
            >
              <Avatar
                isSquare
                user={{ avatar: { type: props.type, bg: isChecked ? props.bg : 0 } }}
                size="xl1"
                isLink={false}
              />

              <Box mt={3} fontSize="13px" fontWeight="semibold" color="gray.700">
                {props.text}
              </Box>
            </Button>
          );
        })}
      </Flex>
    );
  },
  (prev, next) => prev.myRating === next.myRating,
);

// 멤버 한 줄을 담당하는 Row 컴포넌트
type MemberReviewRowProps = {
  user: UserSimpleInfoProps;
  myRating: UserRating | null;
  initialMessage?: string;
  onChangeRating: (rating: UserRating | null) => void;
  onChangeMessage: (message: string) => void; // 부모 state는 안 바꾸고 ref만 업데이트 용도
};

const MemberReviewRow = memo(function MemberReviewRow({
  user,
  myRating,
  initialMessage = "",
  onChangeRating,
  onChangeMessage,
}: MemberReviewRowProps) {
  // 메시지는 로컬 상태로만 관리 (부모 state 건드리지 않음)
  const [message, setMessage] = useState<string>(initialMessage);

  const handleRatingClick = (rating: UserRating | null) => {
    onChangeRating(rating);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value); // 이 Row만 리렌더
    onChangeMessage(value); // 부모는 ref에만 저장, state 변경 없음
  };

  return (
    <Stack pt={1} pb={3} borderBottom="var(--border)" key={user.uid}>
      <ProfileCommentCard
        user={user}
        memo={user.comment}
        rightComponent={
          <Flex>
            <Button
              size="sm"
              leftIcon={<CheckCircleIcon size="sm" color={myRating ? "gray" : "white"} isFill />}
              colorScheme={myRating ? "gray" : "mint"}
              onClick={() => handleRatingClick(null)}
            >
              PASS
            </Button>
          </Flex>
        }
      />

      <RatingAvatarRow myRating={myRating} onChangeRating={(rating) => handleRatingClick(rating)} />

      {myRating === "great" && (
        <Box my={3}>
          <Textarea
            value={message}
            onChange={handleTextareaChange}
            placeholder="상대에게 익명 후기를 보낼 수 있어요! 따뜻한 말 한마디가 그 사람의 받은 후기에 차곡차곡 쌓입니다 :)"
            minH="80px"
          />
        </Box>
      )}

      {myRating === "block" && (
        <Box my={3}>
          <Textarea
            value={message}
            onChange={handleTextareaChange}
            placeholder="추가로 공유하고 싶은 사유가 있다면 적어주세요! 작성 내용은 운영진만 확인하며, 익명이 보장됩니다. 비슷한 평가가 반복되는지 확인하겠습니다."
            minH="80px"
          />
        </Box>
      )}
    </Stack>
  );
});

/* ============================= 메인 컴포넌트 ============================= */

function StudyReview() {
  const toast = useToast();
  const router = useRouter();
  const date = router.query?.date as string;
  const id = router.query?.id;

  const resetStudy = useResetStudyQuery();
  const { data: studyPassedData } = useStudyPassedDayQuery(date, {
    enabled: !!date,
  });
  const { data: userInfo } = useUserInfoQuery();

  const study = studyPassedData?.results?.find((result) =>
    id
      ? result.study.place._id === id
      : result.study.members.some((m) => m?.user?._id === userInfo?.id),
  );
  const myStudyInfo = study?.study?.members?.find((member) => member.user._id === userInfo?._id);

  const { mutate, isLoading } = useUserStudyReviewMutation({
    onSuccess() {
      resetStudy();
      toast("success", "리뷰가 완료되었습니다.");
      router.push("/home");
    },
  });

  // 평점만 저장하는 state (message는 ref로 관리)
  const [userReviewArr, setUserReviewArr] = useState<UserReviewProps[]>([]);
  // uid -> message 매핑을 ref로 관리 (state X)
  const messageRef = useRef<Record<string, string>>({});

  const accMinutes = userInfo?.studyRecord?.monthMinutes + userInfo?.studyRecord?.monthCnt;

  const gridProps = study
    ? [
        { title: "장소", text: `${study.study.place.location.name}` },
        {
          title: "날짜",
          text: `${dayjsToFormat(dayjs(study.date).locale("ko"), "M월 D일(ddd)")}`,
        },
        {
          title: "내 공부 시간",
          text: `${dayjs(myStudyInfo?.time?.start).format("HH:mm")} - ${dayjs(
            myStudyInfo?.time?.end,
          ).format("HH:mm")}`,
        },
        {
          title: "누적 스터디 시간",
          text: `${Math.floor(accMinutes / 60)}시간 ${accMinutes % 60}분`,
        },
      ]
    : [];

  const handleSubmit = () => {
    if (!study) return;

    const members: UserSimpleInfoProps[] = [...study.study.members.map((par) => par.user)].filter(
      (who) =>
        (who as UserSimpleInfoProps)._id !== userInfo?._id &&
        (who as UserSimpleInfoProps).uid !== "3224546232",
    ) as UserSimpleInfoProps[];

    // mutate에 넘길 실제 payload 타입 (로컬 전용)
    type ReviewPayload =
      | { toUid: string; rating: UserRating; message: string }
      | { toUid: string; rating: UserRating; message?: undefined };

    const infos = members
      .map<ReviewPayload | null>((member) => {
        const ratingItem = userReviewArr.find((r) => r.toUid === member.uid);
        if (!ratingItem || !ratingItem.rating) return null;

        const message = messageRef.current[member.uid];

        if (message && message.trim().length > 0) {
          return { toUid: member.uid, rating: ratingItem.rating, message };
        }

        // message 없는 케이스도 명시적으로 포함
        return { toUid: member.uid, rating: ratingItem.rating, message: undefined };
      })
      .filter((v): v is ReviewPayload => v !== null);

    mutate({ studyId: study.study.place._id, date, infos });
  };

  return (
    <>
      <Header title={study ? dayjsToFormat(dayjs(study.date).locale("ko"), "익명 리뷰") : ""} />
      {study ? (
        <Slide isNoPadding>
          <Box position="relative" w="full" aspectRatio={1 / 1}>
            <Image
              src={study?.study.place?.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["공통"])}
              fill
              alt="studyRecordImage"
            />
          </Box>

          <Grid
            mt={5}
            mx={5}
            border="var(--border)"
            borderColor="gray.200"
            borderRadius="12px"
            templateColumns="repeat(2,1fr)"
            py={1}
            px={3}
          >
            {gridProps.map((prop) => (
              <GridItem pr={51} py={3} key={prop.title} display="flex" flexDir="column">
                <Box mb={1} fontWeight="medium" fontSize="11px" color="gray.500" lineHeight="12px">
                  {prop.title}
                </Box>
                <Box
                  fontSize="14px"
                  fontWeight="semibold"
                  lineHeight="20px"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {prop.text}
                </Box>
              </GridItem>
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
            {[...study.study.members.map((par) => par.user)]
              .filter(
                (who) =>
                  (who as UserSimpleInfoProps)._id !== userInfo?._id &&
                  (who as UserSimpleInfoProps).uid !== "3224546232",
              )
              .map((member) => {
                const user = member as UserSimpleInfoProps;
                const findMyInfo = userReviewArr.find((props) => props.toUid === user.uid);
                const myRating: UserRating | null = findMyInfo?.rating ?? null;

                const handleChangeRating = (rating: UserRating | null) => {
                  setUserReviewArr((prev) => {
                    // 기존 것 제거
                    const filtered = prev.filter((who) => who.toUid !== user.uid);
                    if (!rating) return filtered; // PASS 누르면 제거

                    // 동일 rating이면 토글처럼 제거
                    const isSame =
                      prev.some((who) => who.toUid === user.uid && who.rating === rating) ||
                      rating === null;
                    if (isSame) return filtered;

                    return [...filtered, { toUid: user.uid, rating }];
                  });
                };

                const handleChangeMessage = (message: string) => {
                  // 부모 state는 안 바꾸고 ref에만 저장 → 리렌더 X
                  messageRef.current[user.uid] = message;
                };

                return (
                  <MemberReviewRow
                    key={user.uid}
                    user={user}
                    myRating={myRating}
                    initialMessage={messageRef.current[user.uid]}
                    onChangeRating={handleChangeRating}
                    onChangeMessage={handleChangeMessage}
                  />
                );
              })}
          </Box>

          <BottomNavButton
            text="멤버 리뷰 완료"
            color="black"
            func={handleSubmit}
            isLoading={isLoading}
          />
        </Slide>
      ) : (
        <MainLoadingAbsolute />
      )}
    </>
  );
}

export default StudyReview;
