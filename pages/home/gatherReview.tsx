import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";

import BottomNavButton from "../../components/atoms/BottomNavButton";
import MenuButton from "../../components/atoms/buttons/MenuButton";
import UserPlusButton from "../../components/atoms/buttons/UserPlusButton";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import ProfileCommentCard from "../../components/molecules/cards/ProfileCommentCard";
import { useGatherIDQuery } from "../../hooks/gather/queries";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

function GatherReview() {
  const searchParams = useSearchParams();
  const gatherIdParam = searchParams.get("date");

  const { data: gather } = useGatherIDQuery(+gatherIdParam, { enabled: !!gatherIdParam });

  const gridProps = gather
    ? [
        {
          title: "모임",
          text: `${gather.title}`,
        },
        {
          title: "모임장",
          text: `${gather.user}`,
        },
        {
          title: "날짜",
          text: `${gather.date}`,
        },
        {
          title: "장소",
          text: `${gather.location.main}`,
        },
      ]
    : [];

  return (
    <>
      <Header title={gather ? dayjsToFormat(dayjs(gather.date), "M월 D일(ddd) 모임") : ""}>
        <MenuButton menuArr={[]} />
      </Header>{" "}
      {gather && (
        <Slide>
          <Grid
            mx={5}
            border="var(--border)"
            borderColor="gray.200"
            borderRadius="12px"
            templateColumns="repeat(2,1fr)"
            py={1}
            px={3}
          >
            {gridProps.map((prop) => (
              <GridItem py={3} key={prop.text} display="flex" flexDir="column">
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
          <Box fontSize="18px" fontWeight="bold" mx={5}>
            같이 공부한 인원
          </Box>
          <Box mb={10} mx={5}>
            {[gather.user, ...gather.participants.map((par) => par.user)].map((member, idx) => {
              const user = member as UserSimpleInfoProps;
              return (
                <ProfileCommentCard
                  user={user}
                  memo={user.comment}
                  key={idx}
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
              );
            })}
          </Box>
        </Slide>
      )}
      <BottomNavButton text="카페 후기 작성하기" color="black" func={() => {}} />
    </>
  );
}

export default GatherReview;
