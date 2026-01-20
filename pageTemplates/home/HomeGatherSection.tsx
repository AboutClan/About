import { AnimatePresence, motion } from "framer-motion";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGatherQuery } from "../../hooks/gather/queries";
import HomeGatherCol from "./HomeGatherCol";

function HomeGatherSection() {
  const { data: gathers } = useGatherQuery(-1);
  console.log(4, gathers);
  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;

  const firstData = gathers?.slice(0, 6);
  const secondData = gathers?.slice(6, 12);
  const thirdData = gathers?.slice(12, 18);

  const { data: gatherData3, isLoading } = useGatherQuery(0, null, "basic");
  console.log(42, gatherData3);
  return (
    <>
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
            subTitle="20대를 위한 편하고 즐거운 만남"
          >
            <HomeGatherCol gathers={[gatherData3?.[1], firstData?.[3]]} isPriority />
          </SlideSectionCol>
          <SlideSectionCol
            title="오늘 뭐하지? About 번개"
            subTitle="20대를 위한 편하고 즐거운 만남"
          >
            <HomeGatherCol gathers={gatherData3?.slice(5, 8)} isPriority={false} />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
      {/* <AnimatePresence initial={false}>
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
            title="최근 제일 핫했던 About 모임"
            subTitle="최근 가장 인기가 많았던 모임"
          >
            <HomeGatherCol gathers={secondData?.slice(0, 3)} isPriority={false} />
          </SlideSectionCol>
          <SlideSectionCol
            title="요즘 제일 핫했던 About 모임"
            subTitle="최근 가장 인기가 많았던 모임"
          >
            <HomeGatherCol gathers={secondData?.slice(3, 6)} isPriority={false} />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence> */}
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
          <SlideSectionCol title="마감 임박! 막차 탑승하기" subTitle="곧 마감되는 인기 모임 리스트">
            <HomeGatherCol gathers={secondData?.slice(0, 3)} isPriority={false} />
          </SlideSectionCol>
          <SlideSectionCol title="마감 임박! 막차 탑승하기" subTitle="곧 마감되는 인기 모임 리스트">
            <HomeGatherCol gathers={secondData?.slice(3, 6)} isPriority={false} />
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
            title="시선 집중! 최근 HOT했던 인기 모임"
            subTitle="실제 후기가 증명하는 베스트 인기 모임"
          >
            <HomeGatherCol gathers={thirdData?.slice(0, 3)} isPriority={false} />
          </SlideSectionCol>
          <SlideSectionCol title="About 인기 최고 모임" subTitle="요즘 제일 주목받는 모임이에요!">
            <HomeGatherCol gathers={thirdData?.slice(3, 6)} isPriority={false} />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default HomeGatherSection;
