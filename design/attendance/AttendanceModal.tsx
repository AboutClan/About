import dayjs from "dayjs";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import { PopOverIcon } from "../../components/atoms/Icons/PopOverIcon";
import { IFooterOptions, ModalLayout } from "../../modals/Modals";
import { IModal } from "../../types/components/modalTypes";
import AttendanceBar from "./AttendanceBar";

interface AttendanceModalProps extends IModal {
  type: 1 | 2;
}

function AttendanceModal({ type, setIsModal }: AttendanceModalProps) {
  const today = dayjs();
  const firstDayOfMonth = today.startOf("month");
  const differenceInDays = today.diff(firstDayOfMonth, "day");
  const weekNumber = Math.floor(differenceInDays / 7) + 1;

  const footerOptions: IFooterOptions = {
    main: {},
    isFull: true,
  };

  return (
    <>
      <ModalLayout
        title={`${dayjs().month() + 1}월 2주차 주간 체크`}
        headerOptions={{}}
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <ScoreBarWrapper>
          <AttendanceBar myScore={17} />
          <span>임시 달성시 +10 포인트, 거북이 아바타 해금!</span>
        </ScoreBarWrapper>
        <ProfileWrapper>
          <span>이승주 {type === 1 ? "(동아리원)" : "(수습멤버)"}</span>
          <ImageWrapper>
            <Avatar image="" size="md" />
          </ImageWrapper>
        </ProfileWrapper>
        <Container>
          <Info>
            <Item>
              <span>{weekNumber}주차 스터디 투표</span>
              <span>2 회</span>
            </Item>
            <Item>
              <span>{weekNumber}주차 스터디 출석</span>
              <span>2 회</span>
            </Item>
            <Item>
              <div style={{ display: "flex" }}>
                <span>이번 달 스터디 점수</span>
                <PopOverIcon
                  title="월간 스터디 점수"
                  text="최소 1점을 넘어야합니다. 출석을 기준으로 정규 스터디는 1회당 1점, 개인, FREE 스터디는 2회당 1점입니다."
                />
              </div>
              <span>40 점</span>
            </Item>
            <Item>
              <span>다음 참여 정산일</span>
              <span> {dayjs().add(1, "month").month() + 1}월 1일</span>
            </Item>
            <Item>
              <span>보유 보증금</span>
              <span>2000원</span>
            </Item>
          </Info>
        </Container>
        <Message>
          {type === 2 ? (
            <div>
              🎉신규 가입을 환영해요🎉
              <br />
              앞으로 열심히 활동해봐요~!
            </div>
          ) : type === 1 ? (
            <div>
              이번 달 스터디에 참여하지 않았어요.
              <br /> {-dayjs().add(1, "month").date(1).diff(dayjs(), "day")}일 뒤에 경고를 받습니다.
            </div>
          ) : (
            <div>
              🎉잘 하고 있어요🎉
              <br />
              이번주도 열심히 파이팅~!
            </div>
          )}
        </Message>
      </ModalLayout>
    </>
  );
}

const Message = styled.div`
  padding: var(--gap-2) var(--gap-3);
  color: var(--gray-2);
  border-radius: var(--rounded);
  background-color: var(--gray-8);
`;

const ProfileWrapper = styled.div`
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: var(--border);
  > span:first-child {
    font-weight: 500;
    font-size: 16px;
  }
`;

const ScoreBarWrapper = styled.div`
  padding: var(--gap-2) 0;
  border-bottom: var(--border);
  display: flex;
  flex-direction: column;
  > span {
    font-size: 12px;
    color: var(--gray-3);
    margin-left: auto;
  }
`;

const Container = styled.div`
  padding: var(--gap-3) 0;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  > span {
    display: inline-block;
    margin-top: var(--gap-1);
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: var(--gap-1) 0;
  > span:last-child {
    font-weight: 600;
  }
`;

export default AttendanceModal;
