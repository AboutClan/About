import { useToast } from "@chakra-ui/react";
import { faCircleXmark, faClock } from "@fortawesome/free-regular-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useRecoilValue } from "recoil";
import { useStudyCancelMutation } from "../../../hooks/study/mutations";
import {
  isVotingState,
  mySpaceFixedState,
  studyDateState,
} from "../../../recoil/studyAtoms";

import { useSession } from "next-auth/react";

import { useState } from "react";
import { POINT_SYSTEM_MINUS } from "../../../constants/pointSystem";
import { MAX_USER_PER_PLACE } from "../../../constants/study";
import { useFailToast } from "../../../hooks/ui/CustomToast";
import {
  usePointMutation,
  useScoreMutation,
} from "../../../hooks/user/pointSystem/mutation";
import { IStudySpaceData } from "../../../pages/about/[date]/[studySpace]";
import { IUser } from "../../../types/user";
import StudySpaceNavModal from "./StudySpaceNavModal";

interface IStudySpaceNavigation {
  studySpaceData: IStudySpaceData;
  voteCnt: number;
}

export type ModalType = "change" | "absent" | "main" | "cancel";

function StudySpaceNavigation({
  studySpaceData: { place, attendences, status },
  voteCnt,
}: IStudySpaceNavigation) {
  const router = useRouter();
  const toast = useToast();
  const failToast = useFailToast();

  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const voteDate = dayjs(router.query.date as string);

  const isMax = voteCnt >= MAX_USER_PER_PLACE;
  const myVote = attendences?.find(
    (props) => (props.user as IUser).uid === session?.uid
  );

  const isVoting = useRecoilValue(isVotingState);
  const studyDate = useRecoilValue(studyDateState);
  const mySpaceFixed = useRecoilValue(mySpaceFixedState);

  const [modalType, setModalType] = useState("");

  const { mutate: getScore } = useScoreMutation();
  const { mutate: getPoint } = usePointMutation();
  const { mutate: handleAbsent } = useStudyCancelMutation(voteDate, {
    onSuccess() {
      router.push(`/about`);
    },
  });

  const cancelFailToast = () => {
    toast({
      title: "취소 불가능",
      description: "참여 확정 이후에는 당일 불참 버튼을 이용해주세요!",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
  };

  const absentFailToast = () => {
    toast({
      title: "오류",
      description: "스터디 확정 이전까지는 취소 또는 변경 버튼을 이용해주세요!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const onBtnClicked = (type: ModalType) => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    if (type === "cancel") {
      if (mySpaceFixed) cancelFailToast();
      else {
        getScore(POINT_SYSTEM_MINUS.cancelStudy.score);
        getPoint(POINT_SYSTEM_MINUS.cancelStudy.point);
        handleAbsent();
      }
      return;
    }
    if (type === "absent" && studyDate === "not passed") {
      absentFailToast();
      return;
    }
    setModalType(type);
  };

  return (
    <>
      {studyDate === "passed" || status === "dismissed" ? (
        <Layout>
          <MainButton disabled={true} func={false}>
            {studyDate === "passed" ? "기간 만료" : "스터디가 열리지 않았어요!"}
          </MainButton>
        </Layout>
      ) : (
        <Layout>
          <SubNav>
            <Button onClick={() => onBtnClicked("cancel")}>
              <FontAwesomeIcon icon={faCircleXmark} size="xl" />
              <span>투표 취소</span>
            </Button>
            <Button onClick={() => onBtnClicked("change")}>
              <FontAwesomeIcon icon={faClock} size="xl" />
              <span>시간 변경</span>
            </Button>
            <Button onClick={() => onBtnClicked("absent")}>
              <FontAwesomeIcon icon={faBan} size="xl" />
              <span>당일 불참</span>
            </Button>
          </SubNav>
          {studyDate === "today" ? (
            <MainButton
              disabled={Boolean(myVote?.arrived)}
              func={!myVote?.arrived}
              onClick={() => {
                onBtnClicked("main");
              }}
            >
              {myVote?.arrived
                ? "출석 완료"
                : myVote?.firstChoice
                ? "출석 체크"
                : "당일 참여"}
            </MainButton>
          ) : (
            <MainButton
              disabled={(isVoting || isMax) && true}
              func={!isVoting && !isMax}
              onClick={() => onBtnClicked("main")}
            >
              {isVoting
                ? "투표 완료"
                : isMax
                ? "정원 마감 (2지망 투표로만 가능)"
                : "스터디 투표"}
            </MainButton>
          )}
        </Layout>
      )}
      <StudySpaceNavModal type={modalType} myVote={myVote} place={place} />
    </>
  );
}

const Layout = styled.div`
  padding: 12px 0;
  margin-top: 16px;
  border-radius: 13px;
`;

const SubNav = styled.nav`
  display: flex;
  margin-bottom: 24px;
  justify-content: space-around;
`;

const Button = styled.button`
  align-items: center;
  color: var(--font-h2);
  width: 60px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  > span {
    font-size: 13px;
  }
`;

const MainButton = styled.button<{ func?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.func ? "var(--color-mint)" : "var(--font-h4)"};
  color: white;
  height: 48px;
  border-radius: 13px;
  padding: 14px 2px 14px 2px;
  font-weight: 700;
  font-size: 15px;
`;

export default StudySpaceNavigation;