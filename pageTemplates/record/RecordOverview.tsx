import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import NotCompletedModal from "../../modals/system/NotCompletedModal";
import { IArrivedData } from "../../types/models/studyTypes/studyRecords";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
interface IRecordOverview {
  arrivedCalendar: IArrivedData[];
}

interface IStudySummary {
  myCnt: number;
  myRecent: number;
  openCnt: number;
  memberCnt: number;
}

function RecordOverview({ arrivedCalendar }: IRecordOverview) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const [studySummary, setStudySummary] = useState<IStudySummary>();
  const [isNotCompleted, setIsNotCompleted] = useState(false);

  useEffect(() => {
    let myRecent = null;
    let openCnt = 0;
    let memberCnt = 0;
    let myCnt = 0;
    const reverseData = arrivedCalendar.slice().reverse();
    reverseData.forEach((item) => {
      if (!item) return;
      const arrivedInfo = item.arrivedInfoList;
      openCnt += arrivedInfo.length;
      arrivedInfo.forEach((info) => {
        const memberList = info.arrivedInfo;
        memberCnt += memberList.length;
        if (memberList.find((who) => who.uid === session?.user?.uid)) {
          myCnt++;
          if (!myRecent) myRecent = item.date;
        }
      });
    });
    const summary = { myCnt, myRecent, openCnt, memberCnt };
    setStudySummary(summary);
  }, [arrivedCalendar, session?.user?.uid]);

  return (
    <>
      <Layout>
        <MyRecord>
          <MyRecordItem>
            <div>
              <ContentName>스터디 오픈</ContentName>
              <ContentValue>{studySummary?.openCnt}회</ContentValue>
            </div>
            <div>
              <ContentName>참여한 인원</ContentName>
              <ContentValue>{studySummary?.memberCnt}명</ContentValue>
            </div>
          </MyRecordItem>
          <MyRecordItem>
            <div>
              <ContentName>내 참여 횟수</ContentName>
              <ContentValue style={{ color: "var(--color-mint)" }}>
                {studySummary?.myCnt}회
              </ContentValue>
            </div>
            <div>
              <ContentName>내 최근 참여</ContentName>
              <ContentValue style={{ color: "var(--color-mint)" }}>
                {!isGuest && studySummary?.myRecent
                  ? dayjsToFormat(dayjs().date(studySummary?.myRecent), "M/D")
                  : "기록 없음"}
              </ContentValue>
            </div>
          </MyRecordItem>
        </MyRecord>
      </Layout>
      {isNotCompleted && <NotCompletedModal setIsModal={setIsNotCompleted} />}
    </>
  );
}

const Layout = styled.div`
  padding: var(--gap-3) var(--gap-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;
const MyRecord = styled.div`
  display: flex;
  height: 100%;
  > div:first-child {
    width: 125px;
  }
  > div:last-child {
    width: 140px;
  }
`;

const MyRecordItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  > div {
    display: flex;
    align-items: center;
  }
`;

const ContentName = styled.span`
  margin-right: var(--gap-2);
  color: var(--gray-600);
  font-size: 13px;
`;

const ContentValue = styled.span`
  font-weight: 700;
  font-size: 14px;
  color: var(--gray-700);
`;

export default RecordOverview;
