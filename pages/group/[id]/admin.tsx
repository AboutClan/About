import { Box, Button } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { UserItem } from "../../../components/molecules/UserItem";
import { useResetGroupQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGroupWaitingStatusMutation } from "../../../hooks/groupStudy/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import GroupAdminInvitation from "../../../pageTemplates/group/admin/GroupAdminInvitation";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { IGroup } from "../../../types/models/groupTypes/group";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";

function Admin() {
  const toast = useToast();
  const { id } = useParams<{ id: string }>() || {};

  const [deletedUsers, setDeletedUser] = useState([]);
  const [group, setGroup] = useState<IGroup>();

  const transferGroup = useRecoilValue(transferGroupDataState);
  const resetGroup = useResetGroupQuery();

  const { data: groupData } = useGroupIdQuery(id, { enabled: !!id && !transferGroup });

  useEffect(() => {
    if (transferGroup) setGroup(transferGroup);
    else if (groupData) setGroup(groupData);
  }, [transferGroup, groupData]);

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
      <Slide isNoPadding>
        <Layout>
          <Title>가입 신청</Title>
          <Question>가입 질문: {group?.questionText} </Question>
          <Container>
            {group?.waiting?.map((who, idx) =>
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
                  {who?.answer && <Content>{who.answer}</Content>}
                </Item>
              ),
            )}
          </Container>
          <Title>
            <Box>유저 초대</Box>
          </Title>
          <GroupAdminInvitation />
        </Layout>
      </Slide>
    </>
  );
}

const Layout = styled.div`
  padding: var(--gap-4);
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 18px;
  border-bottom: var(--border);
  padding: var(--gap-2) 0;
`;

const Question = styled.div`
  padding: var(--gap-3) 0;
  font-size: 16px;
`;

const Container = styled.div`
  margin-bottom: var(--gap-5);
`;

const Item = styled.div``;

const Content = styled.div`
  font-size: 14px;
  padding: var(--gap-3);
`;

export default Admin;
