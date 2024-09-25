import Link from "next/link";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useNoticeActiveLogQuery } from "../../hooks/user/sub/interaction/queries";

function UserProfile() {
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const { data: likeLogs } = useNoticeActiveLogQuery("like");
  const { data: userInfo } = useUserInfoQuery();

  const isGuest = session?.user.role === "guest";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isGuest) {
      e.preventDefault();
      typeToast("guest");
    }
  };

  return (
    <>
      <Info>
        <Link href="/user/friend" passHref onClick={handleClick}>
          <BlockItem>
            <span>
              내 친구{" "}
              <b style={{ display: "inline-block", width: "20px", textAlign: "center" }}>
                {userInfo?.friend.length || 0}
              </b>
              명
            </span>
            <i className="fa-solid fa-chevron-right" />
          </BlockItem>
        </Link>
        <Link href="/user/like" passHref onClick={handleClick}>
          <BlockItem>
            <span>
              받은 좋아요{" "}
              <b style={{ display: "inline-block", width: "20px", textAlign: "center" }}>
                {likeLogs?.length || 0}
              </b>
              개
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

const BlockItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--gap-4);
  border-bottom: var(--border);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  > span:first-child {
    > b {
      color: var(--color-mint);
    }
  }
`;

export default UserProfile;
