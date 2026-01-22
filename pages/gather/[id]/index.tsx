import "dayjs/locale/ko";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { GATHER_COVER_IMAGE_ARR } from "../../../assets/gather";
import Divider from "../../../components/atoms/Divider";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import { GroupThumbnailCard } from "../../../components/molecules/cards/GroupThumbnailCard";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { createGroupThumbnailProps } from "../../../pages/group/index";
import GatherBottomNav from "../../../pageTemplates/gather/detail/GatherBottomNav";
import GatherComments from "../../../pageTemplates/gather/detail/GatherComments";
import GatherContent from "../../../pageTemplates/gather/detail/GatherContent";
import GatherDetailInfo from "../../../pageTemplates/gather/detail/GatherDetail";
import GatherGuide from "../../../pageTemplates/gather/detail/GatherGuide";
import GatherHeader from "../../../pageTemplates/gather/detail/GatherHeader";
import GatherParticipation from "../../../pageTemplates/gather/detail/GatherParticipation";
import GatherTitle from "../../../pageTemplates/gather/detail/GatherTitle";
import { isScrollAutoState } from "../../../recoils/navigationRecoils";
import { IUserSummary, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { getRandomImage } from "../../../utils/imageUtils";

function GatherDetail() {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast();

  const { id } = useParams<{ id: string }>() || {};
  const isGuest = session?.user.name === "guest";

  const setIsScrollAuto = useSetRecoilState(isScrollAutoState);

  const { data: gather } = useGatherIDQuery(+id, {
    enabled: !!id,
    onError() {
      toast("info", "기간이 만료된 모임입니다.");
      router.back();
    },
  });

  const groupId = gather?.groupId;
  const { data: group } = useGroupIdQuery(groupId, { enabled: !!groupId });
  console.log(3, groupId, group);
  console.log(gather);
  const isMember =
    (gather?.user as IUserSummary)?.uid === session?.user.uid ||
    gather?.participants.some((who) => who?.user.uid === session?.user.uid);
  const postImage = gather?.postImage;

  useEffect(() => {
    setIsScrollAuto(true);
  }, []);

  useEffect(() => {
    if (session === undefined) return;
    if (!session?.user.uid) {
      toast("warning", "로그인 정보가 없습니다. 다시 로그인해주세요!");
      router.push(`/login?status=before&page=gather/${id}`);
    }
  }, [session]);

  return (
    <>
      {gather ? (
        <>
          <GatherHeader gatherData={gather} />
          <Slide isNoPadding>
            <Box aspectRatio={2 / 1} position="relative">
              <Image
                src={gather?.coverImage || getRandomImage(GATHER_COVER_IMAGE_ARR["공통"])}
                fill={true}
                sizes="400px"
                alt="study"
                priority={true}
              />
            </Box>
            <Box paddingBottom="100px">
              <GatherTitle
                type={gather.category}
                title={gather.title}
                category={gather.type.title}
                age={gather.age}
                isFree={!gather.isApprovalRequired}
                isGroupGather={!!groupId}
              />
              <GatherDetailInfo data={gather} isMember={isMember} />
              <GatherContent
                content={gather.content}
                gatherList={gather.gatherList}
                postImage={postImage}
                location={gather.location}
              />
              <Divider />
              <GatherParticipation data={gather} />
              {group && (
                <Box px={5} mt={8}>
                  <Box mb={2} fontSize="16px" fontWeight="semibold">
                    연동된 소모임
                  </Box>
                  <GroupThumbnailCard
                    {...createGroupThumbnailProps(group, "pending", null, null, true)}
                  />
                </Box>
              )}
              <GatherGuide
                isAdmin={(gather?.user as UserSimpleInfoProps)?._id === session?.user.id}
              />
              <GatherComments comments={gather.comments} />
            </Box>
          </Slide>
          {!isGuest && <GatherBottomNav data={gather} />}
        </>
      ) : (
        <MainLoading />
      )}
    </>
  );
}

export default GatherDetail;
