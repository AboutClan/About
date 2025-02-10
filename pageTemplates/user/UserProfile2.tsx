import { useSession } from "next-auth/react";
import Link from "next/link";
import styled from "styled-components";

import { Flex } from "@chakra-ui/react";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useNoticeActiveLogQuery } from "../../hooks/user/sub/interaction/queries";

function UserProfile() {
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const { data: likeLogs } = useNoticeActiveLogQuery("like");
  const { data: userInfo } = useUserInfoQuery();

  const isGuest = session?.user.role === "guest";

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    type: "like" | "friend",
  ) => {
    if (isGuest) {
      e.preventDefault();
      typeToast("guest");
    } else if (type === "friend") {
      e.preventDefault();
      typeToast("inspection");
    }
  };

  return (
    <Flex direction="column">
      <Link href="/user/friend" passHref onClick={(e) => handleClick(e, "friend")}>
        <BlockItem>
          <span>
            내 친구 <b>{userInfo?.friend.length || 0}명</b>
          </span>
          <ArrowIcon />
        </BlockItem>
      </Link>
      <Link href="/user/like" passHref onClick={(e) => handleClick(e, "like")}>
        <BlockItem>
          <span>
            받은 좋아요 <b>{likeLogs?.length || 0}개</b>
          </span>
          <ArrowIcon />
        </BlockItem>
      </Link>
    </Flex>
  );
}

const BlockItem = styled.div`
  width: 100%;
  display: flex;
  line-height: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: var(--border);
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  > span:first-child {
    > b {
      color: var(--color-mint);
    }
  }
`;

export default UserProfile;

export const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect width="16" height="16" transform="translate(16 16) rotate(-180)" fill="white" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.74995 2.59993C5.86813 2.59988 5.98515 2.62317 6.09429 2.66847C6.20344 2.71378 6.30256 2.7802 6.38595 2.86393L10.886 7.36393C10.9696 7.44751 11.0359 7.54674 11.0811 7.65595C11.1264 7.76516 11.1497 7.88222 11.1497 8.00043C11.1497 8.11865 11.1264 8.23571 11.0811 8.34492C11.0359 8.45413 10.9696 8.55336 10.886 8.63693L6.38595 13.1369C6.30303 13.2234 6.20368 13.2925 6.09372 13.3401C5.98376 13.3876 5.8654 13.4128 5.7456 13.414C5.62579 13.4153 5.50695 13.3926 5.39603 13.3473C5.28511 13.302 5.18435 13.235 5.09967 13.1502C5.01498 13.0655 4.94807 12.9646 4.90285 12.8537C4.85764 12.7427 4.83504 12.6239 4.83637 12.5041C4.8377 12.3843 4.86294 12.2659 4.9106 12.156C4.95827 12.0461 5.0274 11.9468 5.11395 11.8639L8.97695 7.99993L5.11395 4.13693C4.9879 4.01112 4.90201 3.85074 4.86715 3.67609C4.83229 3.50144 4.85003 3.32038 4.91813 3.15582C4.98622 2.99126 5.10161 2.8506 5.24968 2.75164C5.39776 2.65269 5.57186 2.59989 5.74995 2.59993Z"
      fill="#E0E0E0"
    />
  </svg>
);
