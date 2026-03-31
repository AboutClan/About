import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import BottomNavButton from "../../../components/atoms/BottomNavButton";
import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../../components/molecules/SocialingScoreBadge";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useOpenGatherMemberMutation } from "../../../hooks/gather/mutations";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { IUser, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

export interface OpenGatherVoteProps {
  toUid: string;
  type: "good" | "bad";
}

// 멤버 한 줄을 담당하는 Row 컴포넌트
type MemberReviewRowProps = {
  user: Partial<IUser>;
  changeUserVote: (type: "good" | "bad") => void;
  type: "good" | "bad";
};

const MemberReviewRow = memo(function MemberReviewRow({
  user,
  type,
  changeUserVote,
}: MemberReviewRowProps) {
  return (
    <Stack pt={1} pb={3} borderBottom="var(--border)" key={user.uid}>
      <ProfileCommentCard
        user={user as UserSimpleInfoProps}
        memo={user.comment}
        rightComponent={
          <Box>
            <SocialingScoreBadge size="sm" user={user as UserSimpleInfoProps} />
          </Box>
        }
      />
      <GridItem2
        gender={user.gender}
        birth={user.birth}
        introduceText={user.introduceText}
        mbti={user.mbti}
      />

      <Flex>
        <Button
          onClick={() => {
            changeUserVote("good");
          }}
          flex={1}
          mr={2}
          colorScheme={type === "good" ? "mint" : "gray"}
        >
          좋아요
        </Button>
        <Button
          onClick={() => {
            changeUserVote("bad");
          }}
          flex={1}
          colorScheme={type === "bad" ? "mint" : "gray"}
        >
          패스
        </Button>
      </Flex>
    </Stack>
  );
});

function GatherReview() {
  const toast = useToast();
  const router = useRouter();
  const id = router.query?.id;

  const { data: gather } = useGatherIDQuery(+id, {
    enabled: !!id,
  });

  const { data: userInfo } = useUserInfoQuery();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useOpenGatherMemberMutation(+id, {
    onSuccess() {
      queryClient.resetQueries([GATHER_CONTENT, id + ""]);
      toast("success", "완료되었습니다.");
      router.push(`/gather/${id}`);
    },
  });

  const [userReviewArr, setUserReviewArr] = useState<OpenGatherVoteProps[]>([]);

  useEffect(() => {
    if (gather) {
      setUserReviewArr(gather.participants.map((p) => ({ toUid: p.user.uid, type: "good" })));
    }
  }, [gather]);
  console.log(userReviewArr);
  const handleSubmit = () => {
    if (!gather) return;

    const members: UserSimpleInfoProps[] = [
      gather.user,
      ...gather.participants.map((par) => par.user),
    ].filter(
      (who) =>
        (who as UserSimpleInfoProps)._id !== userInfo?._id &&
        (who as UserSimpleInfoProps).uid !== "3224546232",
    ) as UserSimpleInfoProps[];

    const infos = members
      .map<OpenGatherVoteProps>((member) => {
        const ratingItem = userReviewArr.find((r) => r.toUid === member.uid);
        if (!ratingItem) return null;
        // message 없는 케이스도 명시적으로 포함
        return { toUid: member.uid, type: ratingItem.type };
      })
      .filter((v): v is OpenGatherVoteProps => v !== null);

    mutate(infos);
  };

  return (
    <>
      <Header title={gather ? dayjsToFormat(dayjs(gather.date).locale("ko"), "오픈 번개") : ""} />
      {gather ? (
        <Slide isNoPadding>
          <Box fontSize="18px" fontWeight="bold" mx={5} my={5}>
            <Box>함께하고 싶은 멤버 선택</Box>
            <Box fontSize="12px" color="gray.500" fontWeight={400}>
              선택하신 내용은 100% 익명을 보장합니다.
            </Box>
          </Box>

          <Box mb={10} mx={5}>
            {[gather.user, ...gather.participants.map((par) => par.user)]
              .filter(
                (who) =>
                  (who as UserSimpleInfoProps)._id !== userInfo?._id &&
                  (who as UserSimpleInfoProps).uid !== "3224546232",
              )
              .map((member) => {
                const user = member as Partial<IUser>;
                const findMyInfo = userReviewArr.find((props) => props.toUid === user.uid);
                const myRating: "good" | "bad" = findMyInfo?.type ?? null;

                return (
                  <MemberReviewRow
                    key={user.uid}
                    user={user}
                    type={myRating}
                    changeUserVote={(type: "good" | "bad") => {
                      setUserReviewArr((old) => {
                        const temp = old.filter(
                          (p) => p.toUid !== (member as UserSimpleInfoProps).uid,
                        );
                        const findUser = old.find(
                          (p) => p.toUid === (member as UserSimpleInfoProps).uid,
                        );
                        return [...temp, { toUid: findUser.toUid, type }];
                      });
                    }}
                  />
                );
              })}
          </Box>
          <BottomNavButton
            text="멤버 선택 완료"
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

function GridItem2({ gender, birth, introduceText, mbti }: Partial<IUser>) {
  return (
    <Flex
      flexDirection="column"
      border="var(--border)"
      borderColor="gray.200"
      borderRadius="12px"
      py={1}
      px={3}
    >
      <Flex>
        <Flex flexDir="column" py={3} flex={1}>
          <Box mb={1} fontWeight="medium" fontSize="11px" color="gray.500" lineHeight="12px">
            나이
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
            {birth.slice(0, 2)} 년생
          </Box>
        </Flex>
        <Flex flexDir="column" py={3} flex={1}>
          <Box mb={1} fontWeight="medium" fontSize="11px" color="gray.500" lineHeight="12px">
            성별
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
            {gender}
          </Box>
        </Flex>
        <Flex flexDir="column" py={3} flex={1}>
          <Box mb={1} fontWeight="medium" fontSize="11px" color="gray.500" lineHeight="12px">
            MBTI
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
            {mbti}
          </Box>
        </Flex>
      </Flex>
      <Box pr={5} py={3}>
        <Box mb={1} fontWeight="medium" fontSize="11px" color="gray.500" lineHeight="12px">
          자기소개
        </Box>
        <Box fontSize="14px" fontWeight="semibold">
          {introduceText || "미 작성"}
        </Box>
      </Box>
    </Flex>
  );
}

export default GatherReview;
