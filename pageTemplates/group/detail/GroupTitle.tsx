import { faGear, faUserGroup } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Badge } from "../../../components/atoms/badges/Badges";
import { NewAlertIcon } from "../../../components/atoms/Icons/AlertIcon";
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
  const color =
    status === "gathering"
      ? "mintTheme"
      : status === "open"
        ? maxCnt === 0 || maxCnt > memberCnt
          ? "mintTheme"
          : "redTheme"
        : "redTheme";

  const statusText =
    status === "gathering"
      ? "소그룹"
      : status === "open"
        ? maxCnt === 0 || maxCnt > memberCnt
          ? "모집중"
          : "마감"
        : "마감";

  const onClick = () => {
    router.push(`${router.asPath}/admin`);
  };

  return (
    <Layout status={status}>
      <Title>
        <div>
          <span>{title}</span>
          <Badge text={statusText} colorScheme={color} size="lg" />
        </div>
      </Title>
      <SubInfo>
        <span>
          멤버 {memberCnt} · {category} · {statusText}
        </span>
        {isAdmin && (
          <SettingBtnNav>
            <button onClick={() => router.push(`${router.asPath}/member`)}>
              <FontAwesomeIcon icon={faUserGroup} size="sm" />
            </button>
            <button onClick={onClick}>
              <FontAwesomeIcon icon={faGear} size="sm" />
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
  padding: Var(--gap-4);
  padding-bottom: var(--gap-2);
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
    background-color: var(--gray-7);
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

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--gap-1);
  color: var(--gray-1);
  font-size: 18px;

  font-weight: 800;
  > div:first-child {
    > span {
      margin-right: var(--gap-2);
    }
  }
`;

const SubInfo = styled.div`
  height: 32px;
  font-size: 13px;
  display: flex;
  color: var(--gray-3);
`;

export default GroupTitle;
