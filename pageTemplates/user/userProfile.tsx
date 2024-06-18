import Link from "next/link";
import styled from "styled-components";

import { useUserInfoQuery } from "../../hooks/user/queries";
import { useNoticeActiveLogQuery } from "../../hooks/user/sub/interaction/queries";

function UserProfile() {
  const { data: likeLogs } = useNoticeActiveLogQuery("like");
  const { data: userInfo } = useUserInfoQuery();

  return (
    <>
      <Info>
        <Link href="/user/friend">
          <BlockItem>
            <span>
              내 친구{" "}
              <b style={{ display: "inline-block", width: "20px" }}>{userInfo?.friend.length}</b>명
            </span>
            <i className="fa-solid fa-chevron-right" />
          </BlockItem>
        </Link>
        <Link href="/user/like">
          <BlockItem>
            <span>
              받은 좋아요{" "}
              <b style={{ display: "inline-block", width: "20px" }}>{likeLogs?.length || 0}</b>개
            </span>
            <i className="fa-solid fa-chevron-right" />
          </BlockItem>
        </Link>
      </Info>
    </>
  );
}

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const BlockItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--gap-4);
  border-bottom: var(--border);
  font-weight: 600;
  > span:first-child {
    > b {
      color: var(--color-mint);
    }
  }
`;

export default UserProfile;
