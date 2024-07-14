import "dayjs/locale/ko"; // 로케일 플러그인 로드

import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { GROUP_GATHERING_IMAGE } from "../../../assets/images/randomImages";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import { GROUP_STUDY_ALL } from "../../../constants/keys/queryKeys";
import { useGroupAttendancePatchMutation } from "../../../hooks/groupStudy/mutations";
import { useGroupQuery } from "../../../hooks/groupStudy/queries";
import { checkGroupGathering } from "../../../libs/group/checkGroupGathering";
import GroupBottomNav from "../../../pageTemplates/group/detail/GroupBottomNav";
import GroupComments from "../../../pageTemplates/group/detail/GroupComment";
import GroupContent from "../../../pageTemplates/group/detail/GroupContent/GroupStudyContent";
import GroupCover from "../../../pageTemplates/group/detail/GroupCover";
import GroupHeader from "../../../pageTemplates/group/detail/GroupHeader";
import GroupParticipation from "../../../pageTemplates/group/detail/GroupParticipation";
import GroupTitle from "../../../pageTemplates/group/detail/GroupTitle";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { IGroup } from "../../../types/models/groupTypes/group";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

function GroupDetail() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>() || {};

  const [group, setGroup] = useState<IGroup>();

  const setTransferGroup = useSetRecoilState(transferGroupDataState);

  const { data: groups } = useGroupQuery();

  useEffect(() => {
    if (groups) {
      const findGroup = groups.find((item) => item.id + "" === id);
      setGroup(findGroup);
      setTransferGroup(findGroup);
    }
  }, [groups, id]);

  const queryClient = useQueryClient();

  const { mutate: patchAttendance } = useGroupAttendancePatchMutation(+id, {
    onSuccess() {
      queryClient.invalidateQueries([GROUP_STUDY_ALL]);
    },
  });

  useEffect(() => {
    if (!group) return;
    const firstDate = group.attendance.firstDate;
    if (!firstDate) return;
    if (firstDate !== dayjsToStr(dayjs().subtract(1, "day").startOf("week").add(1, "day")))
      patchAttendance();
  }, [group?.attendance?.firstDate]);

  const belong = group && checkGroupGathering(group.hashTag);

  return (
    <>
      <GroupHeader group={group} />
      <Slide>
        {group && (
          <Layout>
            <GroupCover image={belong ? GROUP_GATHERING_IMAGE : group?.image} />
            <GroupTitle
              isAdmin={group.organizer.uid === session?.user.uid}
              memberCnt={group.participants.length}
              title={group.title}
              status={group.status}
              category={group.category.main}
              maxCnt={group.memberCnt.max}
              isWaiting={group.waiting.length !== 0}
            />
            <GroupContent group={group} />
            <GroupParticipation data={group} />
            <GroupComments comment={group.comment} />
          </Layout>
        )}
      </Slide>
      {!group && <MainLoading />}
      {group &&
      ![group.organizer, ...group.participants.map((who) => who.user)].some(
        (who) => who?.uid === session?.user.uid,
      ) ? (
        <GroupBottomNav data={group} />
      ) : null}
    </>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  background-color: var(--gray-100);
`;

export default GroupDetail;
