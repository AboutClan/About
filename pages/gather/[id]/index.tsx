import "dayjs/locale/ko";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import { useGatherIDQuery } from "../../../hooks/gather/queries";
import GatherBottomNav from "../../../pageTemplates/gather/detail/GatherBottomNav";
import GatherComments from "../../../pageTemplates/gather/detail/GatherComments";
import GatherContent from "../../../pageTemplates/gather/detail/GatherContent";
import GatherDetailInfo from "../../../pageTemplates/gather/detail/GatherDetail";
import GatherHeader from "../../../pageTemplates/gather/detail/GatherHeader";
import GatherOrganizer from "../../../pageTemplates/gather/detail/GatherOrganizer";
import GatherParticipation from "../../../pageTemplates/gather/detail/GatherParticipation";
import GatherTitle from "../../../pageTemplates/gather/detail/GatherTitle";
import { transferGatherDataState } from "../../../recoils/transferRecoils";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

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
            <Layout>
              <GatherOrganizer
                createdAt={gather.createdAt}
                organizer={gather.user as IUserSummary}
                isAdminOpen={gather.isAdminOpen}
                category={gather.type.title}
              />
              <GatherDetailInfo data={gather} />
              <GatherTitle title={gather.title} status={gather.status} />
              <GatherContent
                kakaoUrl={gather?.kakaoUrl}
                content={gather.content}
                gatherList={gather.gatherList}
                isMember={isMember}
              />
              <GatherParticipation data={gather} />
              <GatherComments comments={gather.comments} />
            </Layout>
          </Slide>
          {!isGuest && <GatherBottomNav data={gather} />}
        </>
      ) : (
        <MainLoading />
      )}
    </>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--gray-100);
  padding-bottom: 100px;
`;

export default GatherDetail;
