import { Box, Button, Flex, Stack , Text, VStack } from "@chakra-ui/react";
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

export interface OpenGatherVoteProps {
  user: Partial<IUser>;
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
    <Stack pt={1} pb={3} borderBottom="var(--border-main)" key={user.uid}>
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

      <Flex mt={1}>
        <Button
          onClick={() => {
            changeUserVote("good");
          }}
          flex={1}
          colorScheme="mint"
          size="lg"
          mr={2}
        >
          좋아요
        </Button>
        <Button
          onClick={() => {
            changeUserVote("bad");
          }}
          flex={1}
          colorScheme={type === "bad" ? "mint" : "gray"}
          size="lg"
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
      setUserReviewArr(
        gather.participants
          .filter((p) => p.user._id !== userInfo?._id)
          ?.map((p) => ({ user: p.user as Partial<IUser>, type: null })),
      );
    }
  }, [gather, userInfo]);

  const [isModal, setIsModal] = useState(false);

  const handleSubmit = () => {
    const members = userReviewArr.map((u) => ({ toUid: u.user.uid, type: u.type || "good" }));
    mutate(members);
  };

  return (
    <>
      <Header title={gather ? "오픈번개 멤버 선택" : ""} />
      {gather ? (
        <Slide isNoPadding>
          <ProcessGuide />
          <Box mb={10} mx={5}>
            {[...userReviewArr]
              ?.filter((u) => u.type === null)
              ?.map((member) => {
                const { user, type } = member;
                return (
                  <MemberReviewRow
                    key={user.uid}
                    user={user}
                    type={type}
                    changeUserVote={(type: "good" | "bad") => {
                      setUserReviewArr((old) => {
                        const temp = old.filter((p) => p.user.uid !== user.uid);
                        const findUser = old.find((p) => p.user.uid === user.uid);
                        const data = [...temp, { user: findUser.user, type }];
                        return data;
                      });
                    }}
                  />
                );
              })}
          </Box>
          <BottomNavButton
            text="멤버 선택 완료"
            color="black"
            func={() => setIsModal(true)}
            isLoading={isLoading}
          />
        </Slide>
      ) : (
        <MainLoadingAbsolute />
      )}
      {isModal && (
        <ModalLayout
          setIsModal={setIsModal}
          title="선택 완료"
          footerOptions={{
            main: {
              text: "완 료",
              func: () => {
                handleSubmit();
              },
            },
            sub: {
              text: "다시 선택",
              func: () => {
                setUserReviewArr(
                  gather.participants
                    .filter((p) => p.user._id !== userInfo?._id)
                    .map((p) => ({
                      user: p.user as Partial<IUser>,
                      type: null,
                    })),
                );
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                setIsModal(false);
              },
            },
          }}
        >
          멤버 선택을 완료하시겠어요?
          <br />
          수요일 중에 결과가 확정됩니다.
          <br />
        </ModalLayout>
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


import Divider from "../../../components/atoms/Divider";
import { ModalLayout } from "../../../modals/Modals";

type StepItem = {
  step: number;
  title: string;
  description?: string;
  date?: string;
};

function StepCircle({ step }: { step: number }) {
  return (
    <Flex
      w="20px"
      h="20px"
      borderRadius="full"
      bg="gray.500"
      color="white"
      fontSize="10px"
      fontWeight="600"
      align="center"
      justify="center"
      lineHeight="1"
    >
      {step}
    </Flex>
  );
}

function StepConnector({ isBig }: { isBig?: boolean }) {
  return <Box w="2px" my={1} minH={isBig ? "32px" : "20px"} bg="gray.200" borderRadius="full" />;
}

function StepRow({ item, isLast }: { item: StepItem; isLast: boolean }) {
  return (
    <Flex align="flex-start" w="full">
      <Flex flexDir="column" mr={3} flexShrink={0} w="full">
        <Flex>
          <StepCircle step={item.step} />
          <Text ml={2} color="gray.600" fontWeight={600} fontSize="13px" lineHeight="20px">
            {item.title}
          </Text>
        </Flex>

        <Flex align="flex-start">
          <Box ml={!isLast ? "9px" : "11px"}>{!isLast && <StepConnector isBig={true} />}</Box>
          <Box flex={1}>
            {item.description && (
              <Text color="gray.500" fontSize="12px" mt={1} ml={4}>
                {item.description}
              </Text>
            )}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

function ProcessGuide() {
  const steps: StepItem[] = [
    {
      step: 1,
      title: "함께하고 싶은 멤버는 '좋아요'를 눌러주세요",
      description: "선택하신 내용은 100% 익명이 보장됩니다.",
    },
    {
      step: 2,
      title: "함께하고 싶지 않은 멤버는 '패스'를 눌러주세요",
      description: "선택하지 않은 멤버는 [좋아요]로 제출돼요!",
    },
    {
      step: 3,
      title: "서로 '좋아요'를 누른 멤버끼리만 조가 편성돼요",
      description: "[멤버 선택 완료]를 누르면 신청이 확정됩니다.",
    },
    {
      step: 4,
      title: "톡방이 개설되고, 함께 모임을 진행해요!",
      description: "매칭이 안되는 경우도 많으니 다음에 또 신청해 주세요!",
    },
  ];

  return (
    <Box>
      <Box my={4} mb={3} px={5} fontSize="18px" fontWeight="semibold">
        선택 가이드
      </Box>
      <Box bg="gray.100" border="var(--border-main)" borderRadius="8px" p={5} py={4} mx={5} mb={5}>
        <VStack spacing={0} align="stretch">
          {steps.map((item, index) => (
            <StepRow key={item.step} item={item} isLast={index === steps.length - 1} />
          ))}
        </VStack>
      </Box>
      <Divider />
      <Box my={4} mb={3} px={5} fontSize="18px" fontWeight="semibold">
        함께하고 싶은 멤버 선택
      </Box>
    </Box>
  );
}

export default GatherReview;
