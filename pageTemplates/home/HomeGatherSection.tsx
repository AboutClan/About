import { AnimatePresence, motion } from "framer-motion";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGatherQuery } from "../../hooks/gather/queries";
import { shuffleArray } from "../../utils/convertUtils/convertDatas";
import HomeGatherCol from "./HomeGatherCol";

function HomeGatherSection() {
  const { data: gathers } = useGatherQuery(-1);

  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;
  console.log(54, gathers);
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
          <SlideSectionCol title="About 번개 모임" subTitle="친구들과의 즐거운 만남">
            <HomeGatherCol gathers={gathers?.slice(0, 3)} isPriority />
          </SlideSectionCol>
          <SlideSectionCol title="About 번개 모임" subTitle="같은 관심사를 나누는 만남의 장">
            <HomeGatherCol gathers={gathers?.slice(3, 6)} isPriority={false} />
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
          <SlideSectionCol title="About 마감 임박 모임" subTitle="곧 마감! 마지막 기회">
            <HomeGatherCol gathers={shuffleArray(gathers?.slice(6, 9))} isPriority={false} />
          </SlideSectionCol>
          <SlideSectionCol title="About 마감 임박 모임" subTitle="지금 아니면 늦어요!">
            <HomeGatherCol gathers={shuffleArray(gathers?.slice(9))} isPriority={false} />
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
          <SlideSectionCol title="About 인기 최고 모임" subTitle="최근 가장 핫한 모임이에요!">
            <HomeGatherCol gathers={gathers?.slice(12, 15)} isPriority={false} />
          </SlideSectionCol>
          <SlideSectionCol title="About 인기 최고 모임" subTitle="요즘 제일 주목받는 모임이에요!">
            <HomeGatherCol gathers={gathers?.slice(15)} isPriority={false} />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default HomeGatherSection;
