import { Box, ListItem, UnorderedList } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import styled from "styled-components";

import { useUserInfoQuery } from "../../hooks/user/queries";
import { getUserRole } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import PointScoreBar from "../point/pointScore/PointScoreBar";

function UserProfile() {
  // const { data: myArrivedCnt, isLoading } = useStudyArrivedCntQuery(
  //   userInfo?.uid as string
  // );

  const { data: userInfo } = useUserInfoQuery();

  return (
    <>
      <Score>
        <PointScoreBar myScore={userInfo?.score} />
      </Score>
      <Detail>
        <UnorderedList>
          <ListItem>
            <Box display="inline-block" w="60px">
              역할 구성:
            </Box>
            <b>{getUserRole(userInfo.role)}</b>
          </ListItem>
          <ListItem>
            <Box display="inline-block" w="60px">
              활동 지역:
            </Box>
            <b>{userInfo.location}</b>
          </ListItem>
          <ListItem>
            <Box display="inline-block" w="60px">
              내 가입일:
            </Box>
            <b>{dayjsToFormat(dayjs(userInfo?.registerDate), "YY년 M월 D일")}</b>
          </ListItem>
        </UnorderedList>
      </Detail>
      <Info>
        <Link href="/user/friend">
          <BlockItem>
            <span>
              내 친구 <b>{userInfo?.friend.length}</b>명
            </span>
            <FontAwesomeIcon icon={faChevronRight} />
          </BlockItem>
        </Link>
        <Link href="/user/like">
          <BlockItem>
            <span>
              받은 좋아요 <b>7</b>개
            </span>
            <FontAwesomeIcon icon={faChevronRight} />
          </BlockItem>
        </Link>
        <Link href="/user/point">
          <BlockItem>
            <span>
              내 포인트 <b>{userInfo?.point}</b> P
            </span>
            <FontAwesomeIcon icon={faChevronRight} />
          </BlockItem>
        </Link>
        <Link href="/user/deposit">
          <BlockItem>
            <span>
              내 보증금 <b>{userInfo?.deposit}</b> M
            </span>
            <FontAwesomeIcon icon={faChevronRight} />
          </BlockItem>
        </Link>
      </Info>
    </>
  );
}

const Score = styled.div`
  margin: 0px 16px;
  margin-bottom: 12px;
`;

const Detail = styled.ul`
  padding: var(--gap-4);
  background-color: var(--gray-200);
  font-size: 13px;
`;

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
