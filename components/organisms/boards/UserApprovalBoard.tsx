import { Box, Button, Flex, Stack } from "@chakra-ui/react";

import { IUser, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import ProfileCommentCard from "../../molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../molecules/SocialingScoreBadge";

interface UserApprovalBoardProps {
  users: { user: UserSimpleInfoProps; text: string }[];
  handleApprove: (userId: string) => void;
  handleRefuse: (userId: string) => void;
}

function UserApprovalBoard({ users, handleApprove, handleRefuse }: UserApprovalBoardProps) {
  return (
    <Flex direction="column">
      <Box mb={10} mx={5}>
        {[...users]?.map((member) => {
          const { user } = member;
          return (
            <Block
              key={user.uid}
              user={user as Partial<IUser>}
              changeUserVote={(type: "agree" | "refuse") => {
                if (type === "agree") {
                  handleApprove(user._id);
                } else {
                  handleRefuse(user._id);
                }
                // setUserReviewArr((old) => {
                //   const temp = old.filter((p) => p.user.uid !== user.uid);
                //   const findUser = old.find((p) => p.user.uid === user.uid);
                //   const data = [...temp, { user: findUser.user, type }];
                //   return data;
                // });
              }}
            />
          );
        })}
      </Box>
    </Flex>
  );
}

function Block({
  user,
  changeUserVote,
}: {
  user: Partial<IUser>;
  changeUserVote: (type: "agree" | "refuse") => void;
}) {
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
            changeUserVote("agree");
          }}
          flex={1}
          colorScheme="mint"
          size="lg"
          mr={2}
        >
          참여 승인
        </Button>
        <Button
          onClick={() => {
            changeUserVote("refuse");
          }}
          flex={1}
          size="lg"
        >
          참여 거절
        </Button>
      </Flex>
    </Stack>
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
export default UserApprovalBoard;
