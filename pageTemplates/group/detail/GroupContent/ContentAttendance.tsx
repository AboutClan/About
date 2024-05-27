import { Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useFailToast } from "../../../../hooks/custom/CustomToast";
import AttendCheckModal from "../../../../modals/groupStudy/AttendCheckModal";
import { IWeekRecord } from "../../../../types/models/groupTypes/group";
import { dayjsToFormat } from "../../../../utils/dateTimeUtils";

function ContentAttend({ group }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const failToast = useFailToast();
  const [isThisWeek, setIsThisWeek] = useState(true);

  const id = router.query.id;
  const uid = session?.user.uid;

  const [attendRecord, setAttendRecord] = useState<IWeekRecord[]>([]);

  const weekDay = ["월", "화", "수", "목", "금", "토", "일"];
  const topLineArr = ["이름", ...weekDay];

  const isNotMember =
    group.organizer.uid !== uid && !group.participants.some((who) => who.user.uid === uid);

  const sortArr = (arr: IWeekRecord[]): IWeekRecord[] => {
    const temp: IWeekRecord[] = [];
    let idxNum = null;

    for (let i = 0; i < arr.length; i++) {
      const who = arr[i];
      if (who.uid === uid) {
        idxNum = i;
        break;
      }
      temp.push(who);
    }

    if (idxNum !== null) return [...arr.slice(idxNum), ...temp];
    else return temp;
  };

  useEffect(() => {
    const attendance = group.attendance;
    const weekArr = isThisWeek ? sortArr(attendance.thisWeek) : sortArr(attendance.lastWeek);

    for (let i = 0; i < group.participants.length; i++) {
      const who = group.participants[i];
      if (!weekArr.find((item) => item.uid === who.user.uid)) {
        weekArr.push({
          uid: who.user.uid,
          name: who.user.name,
          attendRecord: [],
          attendRecordSub: [],
        });
      }
    }
    setAttendRecord(weekArr || []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.attendance?.lastWeek, group.attendance?.thisWeek, isThisWeek]);

  const onClickAttend = () => {
    if (isNotMember) {
      failToast("free", "소속 멤버가 아닙니다.");
      return;
    }
    setIsModal(true);
  };

  const weekNum = isThisWeek ? 0 : -7;

  return (
    <>
      <Layout>
        <Month>
          <IconWrapper onClick={() => setIsThisWeek(false)}>
            {isThisWeek && (
              <i className="fa-solid fa-caret-left fa-sm" style={{ color: "var(--gray-2)" }} />
            )}
          </IconWrapper>
          <div>
            {dayjsToFormat(
              dayjs()
                .subtract(1, "day")
                .startOf("week")
                .add(1 + weekNum, "day"),
              "M월 D일",
            )}{" "}
            ~{" "}
            {dayjsToFormat(
              dayjs()
                .subtract(1, "day")
                .endOf("week")
                .add(1 + weekNum, "day"),
              "M월 D일",
            )}
          </div>
          <IconWrapper onClick={() => setIsThisWeek(true)}>
            {!isThisWeek && (
              <i className="fa-solid fa-caret-right fa-sm" style={{ color: "var(--gray-2)" }} />
            )}
          </IconWrapper>
        </Month>
        <ButtonNav>
          <Button
            fontSize="15px"
            onClick={onClickAttend}
            colorScheme="mintTheme"
            rightIcon={<i className="fa-regular fa-check-circle" />}
            disabled={isNotMember}
          >
            출석체크
          </Button>
        </ButtonNav>
        <Container>
          <TopLine>
            {topLineArr.map((text) => (
              <div key={text}>{text}</div>
            ))}
          </TopLine>
          <Main>
            {attendRecord.map((who) => {
              const attendDays = who.attendRecord;
              const attendDaySub = who?.attendRecordSub;
              const days = weekDay.map((day) => {
                let main = false;
                let sub = false;
                if (attendDays.includes(day)) main = true;
                if (attendDaySub.includes(day)) sub = true;
                return { main, sub };
              });

              return (
                <MainLine key={who.uid}>
                  <Name>{who.name}</Name>
                  {days.map((isAttend, idx) => (
                    <Item key={idx}>
                      {isAttend.main ? (
                        <i
                          className="fa-light fa-check-circle"
                          style={{ color: "var(--color-mint)" }}
                        />
                      ) : isAttend.sub ? (
                        <i className="fa-light fa-triangle" style={{ color: "#FEBC5A" }} />
                      ) : null}
                    </Item>
                  ))}
                </MainLine>
              );
            })}
          </Main>
          {attendRecord.length > 8 && (
            <MoreBtn
              onClick={() => {
                failToast("free", "개발이 완료되지 않은 기능입니다.");
              }}
            >
              더 보기
            </MoreBtn>
          )}
        </Container>
      </Layout>
      {isModal && (
        <AttendCheckModal
          attendRecordSub={attendRecord.find((who) => who.uid === uid)?.attendRecordSub || []}
          attendRecord={attendRecord.find((who) => who.uid === uid)?.attendRecord || []}
          type={isThisWeek ? "this" : "last"}
          setIsModal={setIsModal}
          id={+id}
        />
      )}
    </>
  );
}

const MoreBtn = styled.button`
  align-self: center;
  padding: 0 4px;
  border-radius: 4px;
  margin-top: var(--gap-4);
  margin-bottom: var(--gap-3);
  background-color: rgba(0, 194, 179, 0.1);
  color: var(--color-mint);
  font-size: 13px;
  width: max-content;
`;

const IconWrapper = styled.div`
  width: 22.125px;
  padding: 0 var(--gap-2);
`;

const Layout = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ButtonNav = styled.nav`
  display: flex;
  margin: 0 var(--gap-4);
  margin-bottom: var(--gap-4);
  > button {
    flex: 1;
  }
`;

const Month = styled.div`
  border-radius: var(--rounded);
  margin: var(--gap-4) var(--gap-3);
  padding: var(--gap-2) var(--gap-5);
  background-color: var(--gray-100);
  display: flex;
  align-items: center;

  justify-content: space-around;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const TopLine = styled.div`
  display: flex;
  background-color: var(--gray-100);
  border: var(--border);
  font-size: 13px;
  color: var(--gray-700);
  > div {
    padding: var(--gap-1) 0;
    flex: 1;
    text-align: center;
    border-left: var(--border);
  }
  > div:first-child {
    flex: 1.5;
    border-left: none;
  }
`;

const Main = styled.main``;

const MainLine = styled.div`
  display: flex;
  border-bottom: var(--border);
  > div {
    text-align: center;
    border-left: var(--border);
    padding: var(--gap-1) 0;
  }
  > div:first-child {
    border-left: none;
  }
`;
const Item = styled.div`
  flex: 1;
`;
const Name = styled.div`
  flex: 1.5;
`;

export default ContentAttend;
