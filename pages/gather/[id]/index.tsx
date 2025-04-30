import "dayjs/locale/ko";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { GATHER_COVER_IMAGE } from "../../../assets/gather";
import Divider from "../../../components/atoms/Divider";
import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import GatherBottomNav from "../../../pageTemplates/gather/detail/GatherBottomNav";
import GatherComments from "../../../pageTemplates/gather/detail/GatherComments";
import GatherContent from "../../../pageTemplates/gather/detail/GatherContent";
import GatherDetailInfo from "../../../pageTemplates/gather/detail/GatherDetail";
import GatherHeader from "../../../pageTemplates/gather/detail/GatherHeader";
import GatherParticipation from "../../../pageTemplates/gather/detail/GatherParticipation";
import GatherTitle from "../../../pageTemplates/gather/detail/GatherTitle";
import { transferGatherDataState } from "../../../recoils/transferRecoils";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { getRandomIdx } from "../../../utils/mathUtils";

function GatherDetail() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>() || {};
  const isGuest = session?.user.name === "guest";

  const [gather, setGather] = useState<IGather>();

  const [transferGather, setTransferGather] = useRecoilState(transferGatherDataState);
  const { data: gatherData } = useGatherIDQuery(+id, { enabled: !!id && !transferGather });

  useEffect(() => {
    if (gatherData) {
      setGather(gatherData);
      setTransferGather(gatherData);
    } else if (transferGather) setGather(transferGather);
  }, [transferGather, gatherData]);

  const isMember =
    (gather?.user as IUserSummary)?.uid === session?.user.uid ||
    gather?.participants.some((who) => who?.user.uid === session?.user.uid);

  return (
    <>
      {gather ? (
        <>
          <GatherHeader gatherData={gather} />
          <Slide isNoPadding>
            <Box aspectRatio={2 / 1} position="relative">
              <Image
                src={
                  gather?.coverImage ||
                  GATHER_COVER_IMAGE[getRandomIdx(GATHER_COVER_IMAGE.length - 1)]
                }
                fill={true}
                sizes="400px"
                alt="study"
                priority={true}
              />
            </Box>
            <Box paddingBottom="100px">
              <GatherTitle title={gather.title} category={gather.type.title} />
              <GatherDetailInfo data={gather} />
              <GatherContent
                kakaoUrl={gather?.kakaoUrl}
                content={gather.content}
                gatherList={gather.gatherList}
                isMember={isMember}
              />
              <Divider />
              <GatherParticipation data={gather} />
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
