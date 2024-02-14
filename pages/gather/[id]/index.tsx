import "dayjs/locale/ko"; // 로케일 플러그인 로드
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { MainLoading } from "../../../components/common/loaders/MainLoading";
import { useGatherQuery } from "../../../hooks/gather/queries";
import GatherBottomNav from "../../../pageTemplates/gather/detail/GatherBottomNav";
import GatherComments from "../../../pageTemplates/gather/detail/GatherComment";
import GatherContent from "../../../pageTemplates/gather/detail/GatherContent";
import GatherDetailInfo from "../../../pageTemplates/gather/detail/GatherDetail";
import GatherHeader from "../../../pageTemplates/gather/detail/GatherHeader";
import GatherOrganizer from "../../../pageTemplates/gather/detail/GatherOrganizer";
import GatherParticipation from "../../../pageTemplates/gather/detail/GatherParticipation";
import GatherTitle from "../../../pageTemplates/gather/detail/GatherTitle";
import { transferGatherDataState } from "../../../recoil/transferDataAtoms";
import { isGuestState } from "../../../recoil/userAtoms";

function GatherDetail() {
  const router = useRouter();
  const gatherId = router.query.id;

  const isGuest = useRecoilValue(isGuestState);
  const [gatherData, setGatherData] = useRecoilState(transferGatherDataState);

  const [isRefetch, setIsRefetch] = useState(false);

  const { refetch } = useGatherQuery({
    enabled: !gatherData,
    onSuccess(data) {
      setGatherData(data.find((item) => item.id === +gatherId));
    },
  });

  useEffect(() => {
    if (isRefetch || !gatherData) {
      setTimeout(() => {
        refetch();
        setIsRefetch(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatherData, isRefetch]);

  return (
    <>
      {gatherData ? (
        <>
          <Layout>
            <GatherHeader gatherData={gatherData} />
            <GatherOrganizer
              createdAt={gatherData.createdAt}
              organizer={gatherData.user}
              isAdminOpen={gatherData.isAdminOpen}
              category={gatherData.type.title}
            />
            <GatherDetailInfo data={gatherData} />
            <GatherTitle title={gatherData.title} status={gatherData.status} />
            <GatherContent
              content={gatherData.content}
              gatherList={gatherData.gatherList}
            />
            <GatherParticipation data={gatherData} />
            <GatherComments comment={gatherData.comment} />
          </Layout>
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
  background-color: var(--font-h8);
  padding-bottom: 100px;
`;

export default GatherDetail;
