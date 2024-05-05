import { Box, Button, Flex, Grid } from "@chakra-ui/react";

import Avatar from "../../../components/atoms/Avatar";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IInviteUserGroups {
  users: IUserSummary[];
  inviteUser: (who: IUserSummary) => void;
}

export default function InviteUserGroups({ users, inviteUser }: IInviteUserGroups) {
  return (
    <Grid mt="20px" templateColumns="repeat(3,1fr)" gap="12px">
      {users?.map((who, idx) => (
        <Flex key={idx} justify="center" align="center">
          <Avatar image={who.profileImage} avatar={who.avatar} uid={who.uid} size="md" />
          <Flex direction="column" ml="8px">
            <Box>{who.name}</Box>
            <Button colorScheme="mintTheme" size="xs" onClick={() => inviteUser(who)}>
              초대
            </Button>
          </Flex>
        </Flex>
      ))}
    </Grid>
  );
}
