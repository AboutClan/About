import { Box, Button, Flex, Grid, GridItem, Stack } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GATHER_MAIN_IMAGE } from "../../assets/gather";
import Avatar from "../../components/atoms/Avatar";
import BottomNavButton from "../../components/atoms/BottomNavButton";
import UserPlusButton from "../../components/atoms/buttons/UserPlusButton";
import { PopOverIcon } from "../../components/Icons/PopOverIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import ProfileCommentCard from "../../components/molecules/cards/ProfileCommentCard";
import { GATHER_REVIEW_ID } from "../../constants/keys/localStorage";
import { useToast } from "../../hooks/custom/CustomToast";
import { useGatherReviewOneQuery } from "../../hooks/gather/queries";
import { UserRating, UserReviewProps, useUserReviewMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomIdx } from "../../utils/mathUtils";

function GatherReview() {
  const toast = useToast();
  const router = useRouter();
  const { data: gather } = useGatherReviewOneQuery();
  const { data: userInfo } = useUserInfoQuery();

  useEffect(() => {
    localStorage.setItem(GATHER_REVIEW_ID, gather.id + "");
  }, []);

  const { mutate } = useUserReviewMutation({
    onSuccess() {
      toast("success", "리뷰가 완료되었습니다.");
      router.push("/home");
    },
  });

  const [userReviewArr, setUserReviewArr] = useState<UserReviewProps[]>([]);

  const gridProps = gather
    ? [
        {
          title: "모임",
          text: `${gather.title}`,
        },
        {
          title: "날짜",
          text: `${dayjsToFormat(dayjs(gather.date).locale("ko"), "M월 D일(ddd)")}`,
        },
        {
          title: "장소",
          text: `${gather.location.main}`,
        },
        {
          title: "카테고리",
          text: `${gather.type.title}`,
        },
      ]
    : [];

  const avatarArr: { type: number; text: string; rating: UserRating; bg: number }[] = [
    {
      type: 28,
      bg: 7,
      text: "별로예요🫤",
      rating: "block",
    },
    {
      type: 12,
      bg: 0,
      text: "그저 그래요😑",
      rating: "soso",
    },
    {
      type: 11,
      bg: 6,
      text: "좋아요😉 ",
      rating: "good",
    },
    {
      type: 20,
      bg: 1,
      text: "최고예요😘",
      rating: "great",
    },
  ];

  const handleSubmit = () => {
    mutate({ gatherId: gather.id + "", infos: userReviewArr });
  };

  return (
    <>
      <Header
        title={
          gather ? dayjsToFormat(dayjs(gather.date).locale("ko"), "M월 D일(ddd) 모임 리뷰") : ""
        }
      ></Header>{" "}
      {gather && (
        <Slide isNoPadding>
          <Box position="relative" w="full" aspectRatio={1 / 1}>
            <Image
              src={gather?.image || GATHER_MAIN_IMAGE[getRandomIdx(GATHER_MAIN_IMAGE.length)]}
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
              <GridItem pr={51} py={3} key={prop.text} display="flex" flexDir="column">
                <Box mb={1} fontWeight="medium" fontSize="11px" color="gray.500" lineHeight="12px">
                  {prop.title}
                </Box>
                <Box fontSize="14px" fontWeight="semibold" lineHeight="20px">
                  {prop.text}
                </Box>
              </GridItem>
            ))}
          </Grid>
          <Box h={2} bg="gray.100" my={5}></Box>
          <Flex justify="space-between" align="center" fontSize="18px" fontWeight="bold" mx={5}>
            <Box>함께 참여한 인원</Box>
            <Box>
              <PopOverIcon
                text="매너 온도는 그 사람의 모임 후기를 알 수 있는 지표예요. 매너 온도는 매월 1일에, 전전 달 15일부터 전 달 15일까지의 평가가 한 번에 반영됩니다."
                rightText="매너 온도란?"
              />
            </Box>
          </Flex>
          <Box mb={10} mx={5}>
            {[gather.user, ...gather.participants.map((par) => par.user)]
              .filter((who) => (who as UserSimpleInfoProps)._id !== userInfo?._id)
              .map((member, idx) => {
                const user = member as UserSimpleInfoProps;
                return (
                  <Stack pt={1} pb={3} borderBottom="var(--border)" key={idx}>
                    <ProfileCommentCard
                      user={user}
                      memo={user.comment}
                      rightComponent={
                        <Flex>
                          {/* {user._id !== userInfo?._id && (
                        <Button
                          mr={1}
                          borderRadius="50%"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          w={5}
                          h={5}
                          variant="unstyled"
                        >
                          <HeartIcon toUid={user.uid} />
                        </Button>
                      )} */}
                          <UserPlusButton isMyFriend={null} toUid={user.uid} />
                        </Flex>
                      }
                    />
                    <Flex justify="space-between">
                      {avatarArr.map((props, idx) => {
                        const isChecked =
                          userReviewArr.find((props) => props.toUid === user.uid)?.rating ===
                          props.rating;

                        const handleClick = () => {
                          setUserReviewArr((old) => old.filter((who) => who.toUid !== user.uid));
                          setUserReviewArr((old) => [
                            ...old,
                            { toUid: user.uid, rating: props.rating },
                          ]);
                        };

                        return (
                          <Button
                            key={idx}
                            opacity={isChecked ? 1 : 0.5}
                            w="72px"
                            h="100px"
                            variant="nostyle"
                            display="flex"
                            flexDir="column"
                            onClick={handleClick}
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
                  </Stack>
                );
              })}
          </Box>
        </Slide>
      )}
      <BottomNavButton text="멤버 리뷰 완료" color="black" func={handleSubmit} />
    </>
  );
}

export default GatherReview;
