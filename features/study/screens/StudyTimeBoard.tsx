import UserTimeBoard, {
  ITimeBoardParticipant,
} from "@/components/molecules/boards/userTimeBoard/UserTimeBoard";
import { StudyConfirmedMemberProps } from "@/types/models/studyTypes/study-entity.types";

interface IStudyTimeBoard {
  members: StudyConfirmedMemberProps[];
  isCafeMap?: boolean;
}
export default function StudyTimeBoard({ members, isCafeMap }: IStudyTimeBoard) {
  const timeBoardMembers: ITimeBoardParticipant[] = transformToTimeBoardProp(members);

  return <UserTimeBoard members={timeBoardMembers} isCafeMap={isCafeMap} />;
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
