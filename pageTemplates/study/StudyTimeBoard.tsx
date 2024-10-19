import UserTimeBoard, {
  ITimeBoardParticipant,
} from "../../components/molecules/boards/userTimeBoard/UserTimeBoard";
import { StudyMemberProps } from "../../types/models/studyTypes/studyDetails";

interface IStudyTimeBoard {
  members: StudyMemberProps[];
}
export default function StudyTimeBoard({ members }: IStudyTimeBoard) {
  const timeBoardMembers: ITimeBoardParticipant[] = transformToTimeBoardProp(members);

  return <UserTimeBoard members={timeBoardMembers} />;
}

const transformToTimeBoardProp = (members: StudyMemberProps[]) => {
  return members.map((par) => ({
    name: par.user.name,
    time: {
      start: par.time.start,
      end: par.time.end,
    },
  }));
};
