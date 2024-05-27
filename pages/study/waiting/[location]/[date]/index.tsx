import { Box, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import HighlightedTextButton from "../../../../../components/atoms/buttons/HighlightedTextButton";
import Divider from "../../../../../components/atoms/Divider";
import Slide from "../../../../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../../../../components/molecules/navs/TabNav";
import { useStudyVoteQuery } from "../../../../../hooks/study/queries";
import { getStudyDateStatus } from "../../../../../libs/study/date/getStudyDateStatus";
import { getMyStudy } from "../../../../../libs/study/getMyStudy";
import { sortStudyVoteData } from "../../../../../libs/study/sortStudyVoteData";
import { getWaitingSpaceProps } from "../../../../../pageTemplates/home/HomeStudySection";
import StudyCover from "../../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../../pageTemplates/study/StudyHeader";
import StudyWaitingOverview from "../../../../../pageTemplates/study/StudyWaitingOverview";
import StudyWaitingPlaces from "../../../../../pageTemplates/study/StudyWaitingPlaces";
import StudyWaitingUsers from "../../../../../pageTemplates/study/StudyWaitingUsers";
import { myStudyState, studyDateStatusState } from "../../../../../recoils/studyRecoils";
import { ActiveLocation } from "../../../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../../../utils/convertUtils/convertDatas";

export default function Page() {
  const { data: session } = useSession();
  const { location, date } = useParams<{ location: string; date: string }>() || {};

  const setMyStudy = useSetRecoilState(myStudyState);

  const { data: studyAll } = useStudyVoteQuery(
    date,
    convertLocationLangTo(location as ActiveLocation, "kr"),
    {
      enabled: !!location || !!date,
    },
  );

  const [isHidden, setIsHidden] = useState(true);

  const [studyDateStatus, setStudyDateStatus] = useRecoilState(studyDateStatusState);

  useEffect(() => {
    setStudyDateStatus(getStudyDateStatus(date));
  }, [date]);

  useEffect(() => {
    if (!studyAll || !session?.user) return;
    setMyStudy(getMyStudy(studyAll, session.user.uid));
  }, [studyAll]);

  const studyWaitingUsers = studyAll && getWaitingSpaceProps(studyAll);
  const sortedStudyPlaces = studyAll && sortStudyVoteData(studyAll, false);

  const [category, setCategory] = useState("참여 멤버");

  const categoryArr = ["참여 멤버", "스터디"];

  const tabArr: ITabNavOptions[] = categoryArr.map((category) => ({
    text: category,
    func: () => setCategory(category),
    flex: 1,
  }));

  return (
    <Layout>
      {studyWaitingUsers && (
        <>
          <StudyHeader
            brand="스터디 대기소"
            fullname="스터디 대기소"
            locationDetail="세부"
            coverImage="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%8A%A4%ED%86%A0%EC%96%B4/CU_3000%EC%9B%90%EA%B6%8C.webp"
          />
          <Slide>
            <StudyCover
              imageUrl="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%8A%A4%ED%86%A0%EC%96%B4/CU_3000%EC%9B%90%EA%B6%8C.webp"
              brand=""
              isPrivateStudy={false}
            />

            <StudyWaitingOverview title="" />

            <Divider />

            <StudyDateBar
              isPrivateStudy={false}
              place={{
                locationDetail: "",
                fullname: "",
                image:
                  "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%8A%A4%ED%86%A0%EC%96%B4/CU_3000%EC%9B%90%EA%B6%8C.webp",
              }}
            />
            <TabNav tabOptionsArr={tabArr} selected={category} />
            <Box h="4px" />
            {category === "참여 멤버" ? (
              <StudyWaitingUsers studyWaitingUsers={studyWaitingUsers} />
            ) : (
              <StudyWaitingPlaces
                studyWaitingPlaces={isHidden ? sortedStudyPlaces.slice(0, 8) : sortedStudyPlaces}
              />
            )}
            {category === "스터디" && sortedStudyPlaces.length >= 8 && (
              <Flex bgColor="white" justify="center" align="center" py="8px">
                <HighlightedTextButton text="더 보기" onClick={() => setIsHidden(false)} />
              </Flex>
            )}
          </Slide>
        </>
      )}
    </Layout>
  );
}

const Layout = styled.div`
  padding-bottom: 161px;
`;
