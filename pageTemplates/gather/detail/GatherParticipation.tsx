import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import InviteUserModal from "../../../modals/InviteUserModal";
import { prevPageUrlState } from "../../../recoils/navigationRecoils";
import { transferUserSummaryState } from "../../../recoils/transferRecoils";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherParticipation {
  data: IGather;
}

function GatherParticipation({ data }: IGatherParticipation) {
  const { data: session } = useSession();
  const router = useRouter();
  const setTransferUserSummary = useSetRecoilState(transferUserSummaryState);
  const setPrevPageUrl = useSetRecoilState(prevPageUrlState);

  const organizer = data.user as IUserSummary;
  const status = data.status;
  const participantsCnt = data.participants.length;

  const [isModal, setIsModal] = useState(false);

  const isAdminOpen = data.isAdminOpen;

  const onClickProfile = (user: IUserSummary) => {
    setTransferUserSummary(user);
    setPrevPageUrl(router?.asPath);
    router.push(`/profile/${user.uid}`);
  };

  return (
    <>
      <Layout>
        <Header>
          <Box>
            <span>{status === "open" ? "확정 인원" : "참여중인 인원"}</span>
            <span>{isAdminOpen ? participantsCnt : participantsCnt + 1}</span>
            <span>/</span>
            {data?.memberCnt.max ? (
              <span>{data?.memberCnt.max}</span>
            ) : (
              <>
                <span style={{ marginLeft: "4px" }} />
                <i className="fa-solid fa-infinity" style={{ color: "var(--gray-200)" }} />
              </>
            )}
          </Box>
          {session?.user.uid === (organizer as IUserSummary).uid && (
            <Button size="sm" ml="auto" colorScheme="mintTheme" onClick={() => setIsModal(true)}>
              인원초대
            </Button>
          )}
        </Header>
        <Members>
          {!isAdminOpen ? (
            <MemberItem key={organizer?.uid} onClick={() => onClickProfile(organizer)}>
              <Organizer>
                <Avatar
                  image={organizer.profileImage}
                  avatar={organizer.avatar}
                  uid={organizer.uid}
                  size="md"
                />
                <CrownWrapper>
                  <i className="fa-solid fa-crown" style={{ color: "var(--color-orange)" }} />
                </CrownWrapper>
              </Organizer>
              <UserOverview>
                <span>{organizer?.name}</span>
                <div>{organizer?.comment}</div>
              </UserOverview>
            </MemberItem>
          ) : data.participants.length ? null : (
            <Empty>
              <span>참여자를 모집중입니다.</span>
            </Empty>
          )}
          {data?.participants.map(
            (who) =>
              who?.user && (
                <MemberItem key={who?.user.uid} onClick={() => onClickProfile(who.user)}>
                  <Avatar
                    image={who.user.profileImage}
                    avatar={who.user.avatar}
                    uid={who.user.uid}
                    size="md"
                  />
                  <UserOverview>
                    <span>{who?.user?.name}</span>
                    <div>{who?.user.comment}</div>
                  </UserOverview>
                  <ParticipateTime isFirst={who?.phase === "first"}>
                    {who?.phase === "first" ? (
                      <i className="fa-solid fa-1 fa-sm" />
                    ) : (
                      <i className="fa-solid fa-2 fa-sm" />
                    )}
                    <span>차</span>
                  </ParticipateTime>
                </MemberItem>
              ),
          )}
        </Members>
      </Layout>
      {isModal && <InviteUserModal setIsModal={setIsModal} />}
    </>
  );
}
const MemberItem = styled.div`
  padding: var(--gap-2) 0;
  display: flex;
  align-items: center;

  border-bottom: var(--border);
`;

const Header = styled.header`
  font-size: 16px;
  padding: var(--gap-4);
  font-weight: 600;
  border-bottom: var(--border);
  display: flex;
  align-items: center;

  > div:first-child {
    > span:first-child {
      margin-right: var(--gap-3);
    }
    > span:nth-child(2) {
      font-weight: 700;
      color: var(--color-mint);
    }
    > span:nth-child(3) {
      margin: 0 var(--gap-1);
    }
  }
`;

const Members = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 var(--gap-4);
  > div:last-child {
    border: none;
  }
`;

const UserOverview = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  margin-left: var(--gap-3);
  > span:first-child {
    font-size: 14px;
    font-weight: 600;
  }
  > div:last-child {
    width: 95%;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 13px;
  }
`;
const Organizer = styled.div`
  position: relative;
`;

const ParticipateTime = styled.div<{ isFirst: boolean }>`
  font-size: 16px;
  margin-left: auto;
  margin-right: var(--gap-2);
  color: ${(props) => (props.isFirst ? "var(--color-mint)" : "var(--color-orange)")};
  > span:last-child {
    margin-left: 2px;
  }
`;

const CrownWrapper = styled.div`
  position: absolute;
  right: -2px;
  bottom: -2px;
`;
const Layout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding-bottom: var(--gap-4);
  border: var(--border);
`;

const Empty = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  > span {
    font-size: 18px;
    color: var(--gray-500);
  }
`;

export default GatherParticipation;
