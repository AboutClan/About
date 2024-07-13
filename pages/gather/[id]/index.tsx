import "dayjs/locale/ko"; // 로케일 플러그인 로드

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import { MainLoading } from "../../../components/atoms/loaders/MainLoading";
import Slide from "../../../components/layouts/PageSlide";
import { useGatherQuery } from "../../../hooks/gather/queries";
import GatherBottomNav from "../../../pageTemplates/gather/detail/GatherBottomNav";
import GatherComments from "../../../pageTemplates/gather/detail/GatherComment";
import GatherContent from "../../../pageTemplates/gather/detail/GatherContent";
import GatherDetailInfo from "../../../pageTemplates/gather/detail/GatherDetail";
import GatherHeader from "../../../pageTemplates/gather/detail/GatherHeader";
import GatherOrganizer from "../../../pageTemplates/gather/detail/GatherOrganizer";
import GatherParticipation from "../../../pageTemplates/gather/detail/GatherParticipation";
import GatherTitle from "../../../pageTemplates/gather/detail/GatherTitle";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

function GatherDetail() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>() || {};
  const isGuest = session?.user.name === "guest";

  const [gatherData, setGatherData] = useState<IGather>();

  const { data: gather} = useGatherQuery(+id, undefined, { enabled: !!id });
  console.log(24, gathers);

  const isMember =
    (gatherData?.user as IUserSummary)?.uid === session?.user.uid ||
    gatherData?.participants.some((who) => who?.user.uid === session?.user.uid);

  return (
    <>
      {gatherData ? (
        <>
          <GatherHeader gatherData={gatherData} />
          <Slide>
            <Layout>
              <GatherOrganizer
                createdAt={gatherData.createdAt}
                organizer={gatherData.user as IUserSummary}
                isAdminOpen={gatherData.isAdminOpen}
                category={gatherData.type.title}
              />
              <GatherDetailInfo data={gatherData} />
              <GatherTitle title={gatherData.title} status={gatherData.status} />
              <GatherContent
                kakaoUrl={gatherData?.kakaoUrl}
                content={gatherData.content}
                gatherList={gatherData.gatherList}
                isMember={isMember}
              />
              <GatherParticipation data={gatherData} />
              <GatherComments comment={gatherData.comment} />
            </Layout>
          </Slide>
          {!isGuest && <GatherBottomNav data={gatherData} />}
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
