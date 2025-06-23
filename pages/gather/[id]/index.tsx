import "dayjs/locale/ko";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { GATHER_COVER_IMAGE_ARR } from "../../../assets/gather";
import Divider from "../../../components/atoms/Divider";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import GatherBottomNav from "../../../pageTemplates/gather/detail/GatherBottomNav";
import GatherComments from "../../../pageTemplates/gather/detail/GatherComments";
import GatherContent from "../../../pageTemplates/gather/detail/GatherContent";
import GatherDetailInfo from "../../../pageTemplates/gather/detail/GatherDetail";
import GatherGuide from "../../../pageTemplates/gather/detail/GatherGuide";
import GatherHeader from "../../../pageTemplates/gather/detail/GatherHeader";
import GatherParticipation from "../../../pageTemplates/gather/detail/GatherParticipation";
import GatherTitle from "../../../pageTemplates/gather/detail/GatherTitle";
import { IUserSummary, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { getRandomImage } from "../../../utils/imageUtils";

function GatherDetail() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>() || {};
  const isGuest = session?.user.name === "guest";

  const { data: gather } = useGatherIDQuery(+id, { enabled: !!id });

  const isMember =
    (gather?.user as IUserSummary)?.uid === session?.user.uid ||
    gather?.participants.some((who) => who?.user.uid === session?.user.uid);
  const postImage = gather?.postImage;
  console.log(44, gather);
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
                title={gather.title}
                category={gather.type.title}
                isEvent={!!gather?.postImage}
              />
              <GatherDetailInfo data={gather} isEvent={!!gather?.postImage} />
              <GatherContent
                kakaoUrl={gather?.kakaoUrl}
                content={gather.content}
                gatherList={gather.gatherList}
                isMember={isMember}
                postImage={postImage}
              />
              <Divider />
              <GatherParticipation data={gather} />
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
