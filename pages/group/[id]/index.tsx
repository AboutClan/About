import "dayjs/locale/ko"; // 로케일 플러그인 로드

import { Box } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import Divider from "../../../components/atoms/Divider";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import ControlButton from "../../../components/ControlButton";
import Slide from "../../../components/layouts/PageSlide";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGatherGroupQuery, useGroupFeedsQuery } from "../../../hooks/gather/queries";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import GroupBottomNav from "../../../pageTemplates/group/detail/GroupBottomNav";
import GroupContent from "../../../pageTemplates/group/detail/GroupContent";
import GroupCover from "../../../pageTemplates/group/detail/GroupCover";
import GroupHeader from "../../../pageTemplates/group/detail/GroupHeader";
import GroupOverview from "../../../pageTemplates/group/detail/GroupOverview";
import GroupParticipation from "../../../pageTemplates/group/detail/GroupParticipation";
import { setGatherDataToCardCol } from "../../../pageTemplates/home/HomeGatherCol";
import { backUrlState } from "../../../recoils/navigationRecoils";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { shuffleArray } from "../../../utils/convertUtils/convertDatas";
import { ThunderIcon } from "../../gather";

export type GroupSectionCategory = "정 보" | "모 임" | "피 드";

function GroupDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const setBackUrl = useSetRecoilState(backUrlState);
  const isGuest = session?.user.name === "guest";
  const { id } = useParams<{ id: string }>() || {};

  const setGatherWriting = useSetRecoilState(sharedGatherWritingState);

  const { data: group } = useGroupIdQuery(id, { enabled: !!id });
  console.log(4, group);
  const { data: gathers } = useGatherGroupQuery(id, {
    enabled: !!id,
  });

  const { data: gatherFeeds } = useGroupFeedsQuery(id, {
    enabled: !!id,
  });

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      signIn("guest");
      return;
    }
    if (!session?.user.uid) {
      toast("warning", "로그인 정보가 없습니다. 다시 로그인해주세요!");
      router.push(`/login?status=before&page=group/${id}`);
    }
  }, [session]);

  const findMyInfo =
    group?.participants && group.participants.find((who) => who?.user?._id === session?.user?.id);

  const isAdmin =
    findMyInfo?.role === "admin" ||
    findMyInfo?.role === "manager" ||
    session?.user.name === "어바웃";

  const handleGatheringButton = () => {
    setGatherWriting({
      type: { title: group.category.main, subtitle: "" },
      title: `[${group.title}] 오픈 번개`,
      content: `[${group.title}]에서 진행하는 번개입니다! 관심있는 분들 모두 환영해요 :)`,
      image: `${group.squareImage}`,
      coverImage: `${group.image}`,
    });
    router.push(`/gather/writing/category?groupId=${group?.id}`);
  };

  const gatherData =
    gathers &&
    setGatherDataToCardCol(gathers, true, () => {
      setBackUrl(`/group/${id}`);
    });

  return (
    <>
      {group && <GroupHeader group={group} />}
      {group && (
        <Slide isNoPadding>
          <Box mb={10}>
            <GroupCover image={group?.image} />
            <GroupOverview
              group={group}
              isMyGroup={!!findMyInfo}
              gatherCnt={gatherData?.length}
              reviewCnt={gatherFeeds?.length}
            />
            <Divider />
            <GroupContent
              isResting={group.status === "resting"}
              content={group.content}
              rules={group.rules}
              hashTagString={group.hashTag}
            />
            <GroupParticipation
              data={{
                ...group,
                participants: shuffleArray(
                  group?.participants?.filter((par) => par?.role !== "member"),
                ),
              }}
              text="정규 멤버"
              isPlanned={group.participants.length <= 3}
            />
            {/* {group.participants.length >= 2 && (
              <>
                {group.participants.length > 3 &&
                  group?.participants?.filter((par) => par?.role === "member")?.length && (
                    <GroupParticipation
                      data={{
                        ...group,
                        participants: shuffleArray(
                          group?.participants?.filter((par) => par?.role === "member"),
                        ),
                      }}
                      text="임시 멤버"
                      isTemp
                      isPlanned={false}
                    />
                  )}
                <GroupGathering gatherData={gatherData} />
                <GroupReview feeds={gatherFeeds} />
              </>
            )} */}
          </Box>
          {/* {(group.comments.length || findMyInfo) && group.participants.length >= 2 && (
            <GroupComments comments={group.comments} hasAutority={!!findMyInfo} />
          )} */}
        </Slide>
      )}
      {isAdmin && (
        <ControlButton
          rightIcon={<ThunderIcon />}
          text="모임 개설"
          handleClick={handleGatheringButton}
        />
      )}
      {!group && <MainLoading />}
      {group && !findMyInfo && !isGuest && !isAdmin ? <GroupBottomNav data={group} /> : null}
    </>
  );
}

export default GroupDetail;
