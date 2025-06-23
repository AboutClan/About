import { Box, Button, Flex, Grid } from "@chakra-ui/react";

import Avatar from "../../../components/atoms/Avatar";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IInviteUserGroups {
  users: IUserSummary[];
  inviteUser: (who: IUserSummary) => void;
  existUsers?: string[];
  type?: "exile";
}

export default function InviteUserGroups({
  users,
  inviteUser,
  existUsers,
  type,
}: IInviteUserGroups) {
  return (
    <Grid mt="20px" templateColumns="repeat(3,1fr)" gap="12px">
      {users?.map((who, idx) => {
        const isMember = existUsers?.includes(who._id);
        return (
          <Flex h="48px" key={idx} justify="center" align="center">
            <Avatar user={who} size="sm1" />
            <Flex direction="column" justify="space-between" ml={2} align="center">
              <Box fontSize="13px">{who.name}</Box>
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
