import UserTimeBoard, {
  ITimeBoardParticipant,
} from "../../components/molecules/boards/userTimeBoard/UserTimeBoard";
import { StudyConfirmedMemberProps } from "../../types/models/studyTypes/study-entity.types";

interface IStudyTimeBoard {
  members: StudyConfirmedMemberProps[];
}
export default function StudyTimeBoard({ members }: IStudyTimeBoard) {
  const timeBoardMembers: ITimeBoardParticipant[] = transformToTimeBoardProp(members);

  return <UserTimeBoard members={timeBoardMembers} />;
}

const transformToTimeBoardProp = (members: StudyConfirmedMemberProps[]) => {
  return members.map((par) => ({
    name: par.user.name,
    time: {
      start: par.time.start,
      end: par.time.end,
    },
  }));
};
