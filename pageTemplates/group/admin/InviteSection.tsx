import { Box, Button, Flex, Switch, Text } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import { UserItem } from "../../../components/molecules/UserItem";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGroupWaitingStatusMutation } from "../../../hooks/groupStudy/mutations";
import GroupAdminInvitation from "../../../pageTemplates/group/admin/GroupAdminInvitation";
import { IGroup } from "../../../types/models/groupTypes/group";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";

interface InviteSecionProps {
  group: IGroup;
}
export function InviteSection({ group }: InviteSecionProps) {
  const toast = useToast();
  const resetGroup = useResetGroupQuery();
  const [deletedUsers, setDeletedUser] = useState([]);

  const [isInviteTab, setIsInviteTab] = useState(false);

  const { mutate, isLoading } = useGroupWaitingStatusMutation(+group.id, {
    onSuccess() {
      toast("success", "완료되었습니다.");
      resetGroup();
    },
  });

  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    status: "agree" | "refuse",
    user: IUser,
  ) => {
    e.stopPropagation();
    setDeletedUser((old) => [...old, user._id]);
    mutate({ status, userId: user._id });
  };
  return (
    <>
      <Title>신청 인원</Title>
      <Container>
        {group?.waiting?.length ? (
          group?.waiting?.map((who, idx) =>
            deletedUsers.includes(who.user._id) && !isLoading ? null : (
              <Item key={idx}>
                <UserItem user={who.user}>
                  <Button
                    onClick={(e) => onClick(e, "agree", who.user)}
                    size="sm"
                    colorScheme="mint"
                    mr="var(--gap-2)"
                    variant="subtle"
                    isLoading={isLoading}
                  >
                    승인
                  </Button>
                  <Button
                    onClick={(e) => onClick(e, "refuse", who.user)}
                    size="sm"
                    colorScheme="red"
                    variant="subtle"
                    isLoading={isLoading}
                  >
                    거절
                  </Button>
                </UserItem>
                <Text mt={3} mb={1} color="gray.600" fontSize="12px">
                  [신청자 답변]
                </Text>
                <Box bg="gray.100" borderRadius="8px" px={3} py={3}>
                  {group.questionText.map((text, idx) => (
                    <Flex flexDir="column" mt={idx !== 0 ? 3 : 0} key={idx}>
                      <Box mb={1} fontSize="13px">
                        Q&#41; {text}
                      </Box>
                      <Box color="gray.600" fontSize="13px">
                        A&#41; {who?.answer?.[idx]}
                      </Box>
                    </Flex>
                  ))}
                </Box>
              </Item>
            ),
          )
        ) : (
          <Box>신청중인 인원이 없습니다.</Box>
        )}
      </Container>
      <Title>
        <Box>신규 인원 초대</Box>
        <Switch
          colorScheme="mint"
          onChange={(e) => setIsInviteTab(e.target.checked)}
          isChecked={isInviteTab}
        />
      </Title>
      {isInviteTab && <GroupAdminInvitation />}
    </>
  );
}

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 18px;
  border-bottom: var(--border);
  padding: var(--gap-2) 0;
  margin-top: 12px;
`;

const Container = styled.div`
  margin-bottom: 80px;
`;

const Item = styled.div`
  margin-bottom: 12px;
`;
