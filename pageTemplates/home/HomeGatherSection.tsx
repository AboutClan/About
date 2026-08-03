import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGatherQuery } from "../../hooks/gather/queries";
import HomeGatherCol from "./HomeGatherCol";

function HomeGatherSection() {
  const { data: gathers } = useGatherQuery(-1);
  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;

  // 백엔드에서 [featured 3] + [upcoming 6] + [recentlyOpened 6] 순서의 고정 길이 배열로 내려온다.
  const featuredData = gathers?.slice(0, 3);
  const upcomingData = gathers?.slice(3, 9);
  const recentData = gathers?.slice(9, 15);

  return (
    <>
      <Box px={5}>
        <SlideSectionCol
          title="🔥 놓치면 후회하는 About 공식 행사"
          subTitle="오픈 번개 & 정규모임, 지금 바로 신청하세요!"
        >
          <HomeGatherCol gathers={featuredData?.filter((data) => !!data)} isPriority />
        </SlideSectionCol>
      </Box>
      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.3}
          style={{
            marginLeft: "20px",
            display: "flex",
            width: "100%",
            gap: "12px",
          }}
        >
          <SlideSectionCol
            title="오늘 뭐하지? About 번개"
            subTitle="내가 원하는 때, 내 취향대로, 골라서 참여!"
          >
            <HomeGatherCol
              gathers={upcomingData?.slice(0, 3)?.filter((data) => !!data)}
              isPriority={false}
            />
          </SlideSectionCol>
          <SlideSectionCol
            title="오늘 뭐하지? About 번개"
            subTitle="내가 원하는 때, 내 취향대로, 골라서 참여!"
          >
            <HomeGatherCol
              gathers={upcomingData?.slice(3, 6)?.filter((data) => !!data)}
              isPriority={false}
            />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.3}
          style={{
            marginLeft: "20px",
            display: "flex",
            width: "100%",
            gap: "12px",
          }}
        >
          <SlideSectionCol
            title="따끈따끈 방금 개설된 모임"
            subTitle="가장 최근에 새로 열린 모임이에요"
          >
            <HomeGatherCol
              gathers={recentData?.slice(0, 3)?.filter((data) => !!data)}
              isPriority={false}
            />
          </SlideSectionCol>
          <SlideSectionCol
            title="따끈따끈 방금 개설된 모임"
            subTitle="가장 최근에 새로 열린 모임이에요"
          >
            <HomeGatherCol
              gathers={recentData?.slice(3, 6)?.filter((data) => !!data)}
              isPriority={false}
            />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default HomeGatherSection;
