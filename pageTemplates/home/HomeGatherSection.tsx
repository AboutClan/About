import { AnimatePresence, motion } from "framer-motion";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGatherQuery } from "../../hooks/gather/queries";
import HomeGatherCol from "./HomeGatherCol";

function HomeGatherSection() {
  const { data: gathers } = useGatherQuery(-1);

  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;
  console.log(gathers);
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
          <SlideSectionCol title="About 카공 스터디" subTitle="동네 친구와의 스터디">
            <HomeGatherCol gathers={gathers?.slice(6, 9)} isPriority={false} />
          </SlideSectionCol>
          <SlideSectionCol title="About 카공 스터디" subTitle="같이 공부해요">
            <HomeGatherCol gathers={gathers?.slice(9)} isPriority={false} />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default HomeGatherSection;
