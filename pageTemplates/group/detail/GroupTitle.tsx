import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { NewAlertIcon } from "../../../components/Icons/AlertIcon";
import { GatherStatus } from "../../../types/models/gatherTypes/gatherTypes";

interface IGroupTitle {
  title: string;
  status: GatherStatus | "gathering";
  memberCnt: number;
  isAdmin: boolean;
  category: string;
  maxCnt: number;
  isWaiting: boolean;
}

function GroupTitle({
  isAdmin,
  status,
  title,
  memberCnt,
  category,
  maxCnt,
  isWaiting,
}: IGroupTitle) {
  const router = useRouter();

  const statusText =
    status === "gathering"
      ? "소그룹"
      : status === "open" || status === "pending"
      ? maxCnt === 0 || maxCnt > memberCnt
        ? "모집중"
        : "마감"
      : "마감";

  const onClick = () => {
    router.push(`${router.asPath}/admin`);
  };

  return (
    <Layout status={status}>
      <Box fontSize="18px" fontWeight="bold" lineHeight="28px">
        {title}
      </Box>
      <SubInfo>
        <span>
          멤버 {memberCnt} · {category} · {statusText}
        </span>
        {isAdmin && (
          <SettingBtnNav>
            <button onClick={() => router.push(`${router.asPath}/member`)}>
              <i className="fa-regular fa-user-group fa-sm" />
            </button>
            <button onClick={onClick}>
              <i className="fa-regular fa-gear fa-sm" />
              {isWaiting && (
                <IconWrapper>
                  <NewAlertIcon />
                </IconWrapper>
              )}
            </button>
          </SettingBtnNav>
        )}
      </SubInfo>
    </Layout>
  );
}

const IconWrapper = styled.div`
  position: absolute;
  right: -2px;
  bottom: -2px;
`;

const Layout = styled.div<{ status: GatherStatus | "gathering" }>`
  background-color: white;
  border-bottom: var(--border);
  display: flex;
  flex-direction: column;
`;

const SettingBtnNav = styled.nav`
  display: flex;
  margin-left: auto;

  > button {
    margin-left: var(--gap-2);
    border-radius: 50%;
    background-color: var(--gray-200);
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  > button {
    position: relative;
  }
`;

const SubInfo = styled.div`
  height: 32px;
  font-size: 13px;
  display: flex;
  color: var(--gray-600);
`;

export default GroupTitle;
