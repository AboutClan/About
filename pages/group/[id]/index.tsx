import "dayjs/locale/ko"; // 로케일 플러그인 로드

import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import Avatar from "../../../components/atoms/Avatar";
import UserBadge from "../../../components/atoms/badges/UserBadge";
import Divider from "../../../components/atoms/Divider";
import InfoList from "../../../components/atoms/lists/InfoList";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import ControlButton from "../../../components/ControlButton";
import Slide from "../../../components/layouts/PageSlide";
import ValueBoxCol, { ValueBoxColItemProps } from "../../../components/molecules/ValueBoxCol";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import { useGatherGroupQuery, useGroupFeedsQuery } from "../../../hooks/gather/queries";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { IFooterOptions, ModalLayout } from "../../../modals/Modals";
import GroupBottomNav from "../../../pageTemplates/group/detail/GroupBottomNav";
import GroupComments from "../../../pageTemplates/group/detail/GroupComment";
import GroupContent from "../../../pageTemplates/group/detail/GroupContent";
import GroupCover from "../../../pageTemplates/group/detail/GroupCover";
import GroupHeader from "../../../pageTemplates/group/detail/GroupHeader";
import GroupOverview from "../../../pageTemplates/group/detail/GroupOverview";
import GroupParticipation from "../../../pageTemplates/group/detail/GroupParticipation";
import GroupReview from "../../../pageTemplates/group/detail/GroupReview";
import GroupGathering from "../../../pageTemplates/group/GroupGathering";
import { setGatherDataToCardCol } from "../../../pageTemplates/home/HomeGatherCol";
import { backUrlState } from "../../../recoils/navigationRecoils";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { GroupMemberRole } from "../../../types/models/groupTypes/group";
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
  const isResult = router.query.result === "on";

  const [isModal, setIsModal] = useState(false);

  const setGatherWriting = useSetRecoilState(sharedGatherWritingState);

  const { data: group } = useGroupIdQuery(id, { enabled: !!id });

  const { data: gathers } = useGatherGroupQuery(id, {
    enabled: !!id,
  });
  useEffect(() => {
    if (!gathers) return;
    if (isResult) {
      setIsModal(true);
      router.replace(`/group/${id}`);
    }
  }, [isResult, gathers]);

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
    session?.user.name === "어바웃" ||
    session?.user.uid === "2259633694";

  const handleGatheringButton = () => {
    setGatherWriting({
      type: { title: group.category.main, subtitle: "" },
      title: ``,
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

  const subFilterMembers = group?.participants?.filter((par) => par?.role === "member");

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
            {group.participants.length >= 2 ? (
              <>
                {subFilterMembers?.length > 2 && subFilterMembers?.length && (
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
                <GroupGathering gatherData={gatherData} />
                <GroupReview feeds={gatherFeeds} />
              </>
            ) : null}
          </Box>
          {(group.comments.length || findMyInfo) && group.participants.length >= 2 && (
            <GroupComments comments={group.comments} hasAutority={!!findMyInfo} />
          )}
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
      {isModal && (
        <ResultModal onClose={() => setIsModal(false)} gathers={gathers} role={findMyInfo?.role} />
      )}
    </>
  );
}

export function ResultModal({
  onClose,
  gathers,
  role,
}: {
  onClose: () => void;
  gathers: IGather[];
  role: GroupMemberRole;
}) {
  const lastMonthGathers = gathers.filter(
    (gather) =>
      dayjs(gather.date).isAfter(dayjs().subtract(1, "month").startOf("month")) &&
      dayjs(gather.date).isBefore(dayjs().startOf("month")),
  );
  const monthGathers = gathers.filter((gather) =>
    dayjs(gather.date).isAfter(dayjs().startOf("month")),
  );

  const userInfo = useUserInfo();
  const lastMine = lastMonthGathers.filter((gather) =>
    gather.participants?.some((par) => par.user._id === userInfo?._id),
  );
  const monthMine = monthGathers.filter((gather) =>
    gather.participants?.some((par) => par.user._id === userInfo?._id),
  );

  const [isPenaltyModal, setIsPenaltyModal] = useState(false);

  const footerOptions: IFooterOptions = {
    main: {},
    isFull: true,
  };

  const infoList: string[] = [
    "월 1회 모임 참여 또는,",
    "모임 투표 절반 이상 참여 또는,",
    "별도의 휴식 신청",
  ];

  const valueArr: ValueBoxColItemProps[] = gathers && [
    {
      left: "이번 달 개설 모임",
      right: `${lastMonthGathers.length}회`,
    },
    {
      left: "내가 참여한 모임",
      right: `${lastMine.length}회`,
      color: "mint",
    },
    {
      left: "지난 달 개설 모임",
      right: `${monthGathers.length}회`,
    },
    {
      left: "내가 참여한 모임",
      right: `${monthMine.length}회`,
      color: "mint",
    },
  ];
  return (
    <>
      <ModalLayout
        title={`${dayjs().month() + 1}월 활동 점수표`}
        footerOptions={footerOptions}
        setIsModal={onClose}
      >
        <Box minH="240px">
          <Flex align="center">
            <Avatar user={userInfo} size="md1" />
            <Box
              ml={2}
              lineHeight="16px"
              fontSize="12px"
              fontWeight="semibold"
              color="var(--gray-800)"
            >
              {userInfo?.name} (
              {!role
                ? "외부인"
                : role === "regularMember"
                ? "정규 멤버"
                : role === "member"
                ? "임시 멤버"
                : "운영진"}
              )
            </Box>
            <Box ml="auto">
              <UserBadge badgeIdx={userInfo?.badge?.badgeIdx} />
            </Box>
          </Flex>
          <Box my={3} h="1px" bg="gray.100" />

          <Box minH="130px"><ValueBoxCol items={valueArr} /></Box>
          <Button
            variant="unstyled"
            bg="gray.800"
            borderRadius="20px"
            color="white"
            px={3}
            fontSize="10px"
            mx="auto"
            py={2}
            w="max-content"
            mt={5}
            onClick={() => setIsPenaltyModal(true)}
          >
            월간 점수 가이드
          </Button>
        </Box>{" "}
      </ModalLayout>
      {isPenaltyModal && (
        <ModalLayout title="소모임 활동 규정" footerOptions={{}} setIsModal={setIsPenaltyModal}>
          <Box as="p" mb={3}>
            원환한 소모임 운영을 위해 참여 멤버는 <b>다음 중 하나</b>를 만족해야 합니다. 미 활동
            멤버는 <b style={{ color: "var(--color-red)" }}>경고 또는 보증금이 차감</b>될 수
            있습니다.
          </Box>
          <InfoList items={infoList} />
        </ModalLayout>
      )}
    </>
  );
}

export default GroupDetail;
