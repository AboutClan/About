import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { useStudyVoteQuery } from "../../../hooks/study/queries";
import { isMainLoadingState } from "../../../recoil/loadingAtoms";
import { voteDateState } from "../../../recoil/studyAtoms";
import { userLocationState } from "../../../recoil/userAtoms";
import { SUWAN_탐앤탐스 } from "../../../storage/study";
import { IStudy } from "../../../types/study/study";
import AboutMainItem from "./aboutMain/AboutMainItem";
import AboutMainItemSkeleton from "./aboutMain/AboutMainItemSkeleton";

interface IAboutMain {
  participations: IStudy[];
}

function AboutMain({ participations }: IAboutMain) {
  const [voteDate, setVoteDate] = useRecoilState(voteDateState);
  const [interSectionStudy, setInterSectionStudy] = useState<IStudy>();
  const isMainLoading = useRecoilValue(isMainLoadingState);
  const location = useRecoilValue(userLocationState);

  useStudyVoteQuery(voteDate, "수원", {
    enabled: location === "안양",
    onSuccess(data) {
      setInterSectionStudy(
        data.participations.find((study) => study.place._id === SUWAN_탐앤탐스)
      );
    },
  });

  return (
    <AnimatePresence initial={false}>
      {!isMainLoading ? (
        <Layout
          key={voteDate.format("MMDDdd")}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold)
              setVoteDate((old) => old.add(1, "day"));
            else if (swipe > swipeConfidenceThreshold)
              setVoteDate((old) => old.subtract(1, "day"));
          }}
        >
          <Main>
            {participations.map((participation, idx) => (
              <div key={idx}>
                {participation.status === "pending" ||
                participation.attendences.filter((who) => who.firstChoice)
                  .length ? (
                  <Block>
                    <AboutMainItem participation={participation} />
                  </Block>
                ) : null}
              </div>
            ))}
            {location === "안양" &&
            (interSectionStudy?.status === "pending" ||
              interSectionStudy?.attendences.filter((who) => who.firstChoice)
                .length) ? (
              <Block>
                <AboutMainItem participation={interSectionStudy} />
              </Block>
            ) : null}
          </Main>
        </Layout>
      ) : (
        <Layout>
          <Main>
            {[1, 2, 3, 4]?.map((item) => (
              <Block key={item}>
                <AboutMainItemSkeleton />
              </Block>
            ))}
          </Main>
        </Layout>
      )}
    </AnimatePresence>
  );
}

const Layout = styled(motion.div)`
  min-height: 452px;
  margin-top: var(--margin-main);
`;

const Main = styled.main`
  padding: 0 var(--padding-main);
`;

const Block = styled.div``;

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default AboutMain;
