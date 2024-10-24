import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function StudyDateBarSkeleton() {
  const router = useRouter();
  const date = dayjs(router.query.date as string);
  return (
    <>
      <Layout>
        <span>{date.format("M월 D일 참여 멤버")}</span>
        <div />
        <Container>
          <i className="fa-solid fa-user-group fa-sm" />
          <div>
            현재
            <span>
              <Skeleton>t</Skeleton>
            </span>
            명이 투표했어요
          </div>
          <Button size="xs" ml="8px" colorScheme="mint">
            친구초대
          </Button>
        </Container>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
  padding-top: var(--gap-5);
  display: flex;
  flex-direction: column;
  > span:first-child {
    font-weight: 600;
    font-size: 18px;
  }
  > div {
    height: 12px;
  }
`;

const Container = styled.div`
  margin: var(--gap-1) 0;
  display: flex;
  align-items: center;
  color: var(--gray-700);
  > div {
    margin-left: var(--gap-1);
    display: flex;
    align-items: center;
    > span {
      margin-left: var(--gap-1);
      display: inline-block;
      height: 20px;
      width: 8px;
    }
  }
`;

export default StudyDateBarSkeleton;
