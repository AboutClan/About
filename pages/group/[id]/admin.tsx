import { Box, Button } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { UserItem } from "../../../components/molecules/UserItem";
import { useAdminPointSystemMutation } from "../../../hooks/admin/mutation";
import { useCompleteToast } from "../../../hooks/custom/CustomToast";
import { useGroupWaitingStatusMutation } from "../../../hooks/groupStudy/mutations";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import InviteOuterModal from "../../../modals/groupStudy/InviteOuterModal";
import GroupAdminInvitation from "../../../pageTemplates/group/admin/GroupAdminInvitation";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { IGroup } from "../../../types/models/groupTypes/group";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";

function Admin() {
  const completeToast = useCompleteToast();
  const { id } = useParams<{ id: string }>() || {};

  const [deletedUsers, setDeletedUser] = useState([]);
  const [group, setGroup] = useState<IGroup>();
  const [isOuterModal, setIsOuterModal] = useState(false);
  const transferGroup = useRecoilValue(transferGroupDataState);

  const { data: groupData } = useGroupIdQuery(id, { enabled: !!id && !transferGroup });

  useEffect(() => {
    if (transferGroup) setGroup(transferGroup);
    else if (groupData) setGroup(groupData);
  }, [transferGroup, groupData]);

  const { mutate, isLoading } = useGroupWaitingStatusMutation(+id, {
    onSuccess() {
      completeToast("free", "가입되었습니다.");
    },
  });

  const { mutate: getPoint } = useAdminPointSystemMutation();

  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    status: "agree" | "refuse",
    user: IUser,
    pointType?: "point" | "deposit",
  ) => {
    const chargeFee = {
      uid: user.uid,
      type: pointType,
      message: "소모임 가입",
      value: pointType === "deposit" ? -group.fee || -200 : -group.fee * 0.15 || -30,
    };

    e.stopPropagation();
    setDeletedUser((old) => [...old, user._id]);
    await mutate({ status, userId: user._id });
    if (status === "agree") await getPoint(chargeFee);
  };

  return (
    <>
      <Header title="관리자 페이지" />
      <Slide>
        <Layout>
          <Title>가입 신청</Title>
          <Question>가입 질문: {group?.questionText} </Question>
          <Container>
            {group?.waiting?.map((who, idx) =>
              deletedUsers.includes(who.user._id) && !isLoading ? null : (
                <Item key={idx}>
                  <UserItem user={who.user}>
                    <Button
                      onClick={(e) => onClick(e, "agree", who.user, who.pointType)}
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
            <Button onClick={() => setIsOuterModal(true)} size="xs" colorScheme="mint">
              외부 인원 초대
            </Button>
          </Title>
          <GroupAdminInvitation />
        </Layout>
      </Slide>
      {isOuterModal && <InviteOuterModal setIsModal={setIsOuterModal} />}
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
