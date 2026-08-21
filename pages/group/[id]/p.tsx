import "dayjs/locale/ko"; // 로케일 플러그인 로드

import { Box } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

import Divider from "../../../components/atoms/Divider";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import BottomButtonNav from "../../../components/molecules/BottomButtonNav";
import { useGatherGroupQuery, useGroupFeedsQuery } from "../../../hooks/gather/queries";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import GroupContent from "../../../pageTemplates/group/detail/GroupContent";
import GroupCover from "../../../pageTemplates/group/detail/GroupCover";
import GroupOverview from "../../../pageTemplates/group/detail/GroupOverview";
import GroupParticipation from "../../../pageTemplates/group/detail/GroupParticipation";
import GroupReview from "../../../pageTemplates/group/detail/GroupReview";
import GroupGathering from "../../../pageTemplates/group/GroupGathering";
import { setGatherDataToCardCol } from "../../../pageTemplates/home/HomeGatherCol";
import { shuffleArray } from "../../../utils/convertUtils/convertDatas";

// 외부 공유용 공개 미리보기 페이지. 헤더/바텀내브 없이 소모임 정보만 단독으로 보여주고,
// 멤버 전용 정보(티켓)나 다른 페이지로의 이동을 모두 막는다.
function GroupDetailPublicPreview() {
  const { data: session, status } = useSession();
  const { id } = useParams<{ id: string }>() || {};
  const forcedGuestRef = useRef(false);

  const { data: group } = useGroupIdQuery(id, { enabled: !!id });
  const { data: gathers } = useGatherGroupQuery(id, { enabled: !!id });
  const { data: gatherFeeds } = useGroupFeedsQuery(id, { enabled: !!id });

  // 비로그인 상태의 최초 게스트 로그인은 Layout의 전역 effect가 처리한다.
  // 여기서는 실제 멤버 계정으로 접속한 경우까지 강제로 게스트로 전환해,
  // 이 공개 페이지에서는 항상 게스트 시점(멤버 정보 비공개, 이동 버튼 비활성 등)으로 보이게 한다.
  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.role === "guest") return;
    if (forcedGuestRef.current) return;
    forcedGuestRef.current = true;

    const temp = async () => {
      await signOut({ redirect: false });
      await signIn("guest", { redirect: false });
    };
    temp();
  }, [session, status]);

  const gatherData = gathers && setGatherDataToCardCol(gathers, true);

  const subFilterMembers = group?.participants?.filter((par) => par?.role === "member");
  console.log(2, group);
  const handleApply = () => {
    if (!group?.googleFormUrl) return;
    window.open(group.googleFormUrl, "_blank", "noopener,noreferrer");
  };

  if (!group) return <MainLoading />;

  return (
    <>
      <Slide isNoPadding>
        <Box mb={10}>
          <GroupCover image={group?.image} />
          <GroupOverview
            group={group}
            isMyGroup={false}
            gatherCnt={gatherData?.length}
            reviewCnt={gatherFeeds?.length}
            hideMemberOnlyInfo
          />
          <Divider />
          <GroupContent
            isResting={group.status === "resting"}
            content={group.content}
            rules={group.rules}
            hashTagString={group.hashTag}
            isSecret={group.isSecret}
          />
          <GroupParticipation
            data={{
              ...group,
              participants: shuffleArray(
                group?.participants?.filter((par) => par?.role !== "member"),
              ),
            }}
            text={group.participants?.length >= 3 ? "정규 멤버" : "오픈 대기 멤버"}
            isPlanned={group.participants.length <= 3}
          />
          {group?.participants?.length >= 2 ? (
            <>
              {subFilterMembers?.length > 2 && (
                <GroupParticipation
                  data={{
                    ...group,
                    participants: shuffleArray(subFilterMembers),
                  }}
                  text="임시 멤버"
                  isTemp
                  isPlanned={false}
                />
              )}
              {gatherData?.length > 1 && <GroupGathering gatherData={gatherData} disableLink />}
              {gatherFeeds?.length > 1 && <GroupReview feeds={gatherFeeds} />}
            </>
          ) : null}
        </Box>
      </Slide>
      <BottomButtonNav
        text="동아리 가입 신청"
        handleClick={handleApply}
        isReverse={false}
        hasHeart={false}
      />
    </>
  );
}

export default GroupDetailPublicPreview;
