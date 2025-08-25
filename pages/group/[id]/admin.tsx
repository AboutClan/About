import { Box, Button, Flex, Switch, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { UserItem } from "../../../components/molecules/UserItem";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGroupWaitingStatusMutation } from "../../../hooks/groupStudy/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import GroupAdminInvitation from "../../../pageTemplates/group/admin/GroupAdminInvitation";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";

function Admin() {
  const toast = useToast();
  const { id } = useParams<{ id: string }>() || {};

  const [deletedUsers, setDeletedUser] = useState([]);
  const [isInviteTab, setIsInviteTab] = useState(false);

  const resetGroup = useResetGroupQuery();

  const { data: group } = useGroupIdQuery(id, { enabled: !!id });

  const { mutate, isLoading } = useGroupWaitingStatusMutation(+id, {
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
      <Header title="관리자 페이지" />
      <Slide>
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
                    >
                      승인
                    </Button>
                    <Button
                      onClick={(e) => onClick(e, "refuse", who.user)}
                      size="sm"
                      variant="outline"
                      color="var(--color-red)"
                      borderColor="var(--color-red)"
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
      </Slide>
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
`;

const Container = styled.div`
  margin-bottom: 80px;
`;

const Item = styled.div``;

export default Admin;
