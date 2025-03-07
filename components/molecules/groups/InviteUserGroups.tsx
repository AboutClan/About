import { Box, Button, Flex, Grid } from "@chakra-ui/react";

import Avatar from "../../../components/atoms/Avatar";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IInviteUserGroups {
  users: IUserSummary[];
  inviteUser: (who: IUserSummary) => void;
  existUsers?: IUserSummary[];
  type?: "exile";
}

export default function InviteUserGroups({
  users,
  inviteUser,
  existUsers,
  type,
}: IInviteUserGroups) {
  console.log(2, type);
  return (
    <Grid mt="20px" templateColumns="repeat(3,1fr)" gap="12px">
      {users?.map((who, idx) => {
        const isMember = existUsers
          ?.map((user) => {
            return user.uid;
          })
          .includes(who.uid);
        return (
          <Flex key={idx} justify="center" align="center">
            <Avatar
              userId={who._id}
              image={who.profileImage}
              avatar={who.avatar}
              uid={who.uid}
              size="md"
            />
            <Flex direction="column" ml="8px">
              <Box>{who.name}</Box>
              <Button
                colorScheme={isMember && type !== "exile" ? "black" : "mint"}
                size="xs"
                isDisabled={isMember && type !== "exile"}
                onClick={() => inviteUser(who)}
              >
                {type === "exile" ? "추방" : isMember ? "참여중" : "초대"}
              </Button>
            </Flex>
          </Flex>
        );
      })}
    </Grid>
  );
}
