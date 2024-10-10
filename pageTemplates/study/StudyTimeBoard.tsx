import { IHighlightedText } from "../../components/atoms/HighlightedText";
import UserTimeBoard, {
  ITimeBoardParticipant,
} from "../../components/molecules/boards/userTimeBoard/UserTimeBoard";
import {
  IAttendance,
  RealTimeInfoProps,
  StudyStatus,
  StudyUserStatus,
} from "../../types/models/studyTypes/studyDetails";

interface IStudyTimeBoard {
  participants: IAttendance[] | RealTimeInfoProps[];
  studyStatus: StudyStatus | StudyUserStatus;
}
export default function StudyTimeBoard({ participants, studyStatus }: IStudyTimeBoard) {
  const timeBoardParticipants: ITimeBoardParticipant[] = transformToTimeBoardProp(participants);

  const headerText: IHighlightedText = getHeaderText(studyStatus, participants.length);

  return <UserTimeBoard headerText={headerText} participants={timeBoardParticipants} />;
}

const transformToTimeBoardProp = (participants: IAttendance[] | RealTimeInfoProps[]) => {
  return participants.map((par) => ({
    name: par.user.name,
    time: {
      start: par.time.start,
      end: par.time.end,
    },
  }));
};

const getHeaderText = (
  studyStatus: StudyStatus | StudyUserStatus,
  num: number,
): IHighlightedText => {
  if (studyStatus === "dismissed") return { text: "오픈되지 않은 스터디입니다." };

  return {
    text: `현재 ${num}명의 멤버가 ${studyStatus === "pending" ? "투표중" : "참여중"}이에요!`,
    hightlightedText: `${num}명의 멤버`,
  };
};
