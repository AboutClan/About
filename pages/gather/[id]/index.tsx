import "dayjs/locale/ko";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { GATHER_COVER_IMAGE_ARR } from "../../../assets/gather";
import Divider from "../../../components/atoms/Divider";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import { GroupThumbnailCard } from "../../../components/molecules/cards/GroupThumbnailCard";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useKakaoShare } from "../../../hooks/custom/KakaoShareHook2";
import { useUserInfo } from "../../../hooks/custom/UserHooks";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import { useGroupIdQuery } from "../../../hooks/groupStudy/queries";
import { ModalLayout } from "../../../modals/Modals";
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
import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { getRandomImage } from "../../../utils/imageUtils";
import { isApp } from "../../../utils/validationUtils";

function GatherDetail() {
  const router = useRouter();
  const { data: session } = useSession();
  const userInfo = useUserInfo();
  const toast = useToast();

  const { id } = useParams<{ id: string }>() || {};

  const setIsScrollAuto = useSetRecoilState(isScrollAutoState);

  const { data: gather } = useGatherIDQuery(+id, {
    enabled: !!id,
    onError() {
      toast("info", "기간이 만료된 모임입니다.");
      router.back();
    },
  });

  const isOpenGather = gather?.category === "openGather";
  const isAdmin = (gather?.user as UserSimpleInfoProps)?._id === userInfo?._id;

  const groupId = gather?.groupId;
  const { data: group } = useGroupIdQuery(groupId, { enabled: !!groupId });

  const isMember =
    (gather?.user as UserSimpleInfoProps)?.uid === session?.user.uid ||
    gather?.participants.some((who) => who?.user?.uid === session?.user.uid);
  const postImage = gather?.postImage;

  useEffect(() => {
    setIsScrollAuto(true);
  }, []);

  const [isModal, setIsModal] = useState(false);
  useEffect(() => {
    if (isAdmin && !!gather) {
      const adminGatherAt = localStorage.getItem("adminGatherId");
      if (!adminGatherAt || +adminGatherAt < gather.id) {
        localStorage.setItem("adminGatherId", gather.id + "");
        setIsModal(true);
      }
    }
  }, [isAdmin, gather]);

  useEffect(() => {
    if (session === undefined) return;
    if (!session?.user.uid) {
      toast("warning", "로그인 정보가 없습니다. 다시 로그인해주세요!");
      router.push(`/login?status=before&page=gather/${id}`);
    }
  }, [session]);
  const { shareToKakao } = useKakaoShare();

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
                isOpenGather={isOpenGather}
              />
              <GatherDetailInfo data={gather} isMember={isMember} isOpenGather={isOpenGather} />
              <GatherContent
                content={gather.content}
                postImage={postImage}
                location={gather.location}
                isOpenGather={isOpenGather}
                id={gather.id}
              />
              <Divider />
              <GatherParticipation data={gather} isOpenGather={isOpenGather} />
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
                isOpenGather={isOpenGather}
              />
              <GatherComments comments={gather.comments} />
            </Box>
          </Slide>
          <GatherBottomNav data={gather} isOpenGather={isOpenGather} />
        </>
      ) : (
        <MainLoading />
      )}
      {isModal && (
        <ModalLayout
          title="모임 개설 완료!"
          setIsModal={setIsModal}
          footerOptions={{
            main: {
              text: "공유하기",
              func: () => {
                shareToKakao({
                  title: gather.title,
                  date: gather.date,
                  subtitle: gather?.content,
                  img: gather?.coverImage || getRandomImage(GATHER_COVER_IMAGE_ARR["공통"]),
                  url:
                    "https://about20s.club" +
                    router.asPath +
                    (isApp() && gather?.groupId ? `?groupId=${gather.groupId}` : "") +
                    `uid=${(gather.user as UserSimpleInfoProps).uid}`,
                });
              },
            },
            sub: {
              text: "닫 기",
              func: () => {
                setIsModal(false);
              },
            },
          }}
        >
          <p>
            친구들에게 아래 링크를 공유해 보세요!
            <br /> 링크를 클릭하면 <b>자동으로 모임에 참여되고</b>
            <br />
            참여권도 소모되지 않아요!
            <br />
          </p>
        </ModalLayout>
      )}
    </>
  );
}

export default GatherDetail;
