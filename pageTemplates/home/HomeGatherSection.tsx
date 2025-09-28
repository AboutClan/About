import { Box } from "@chakra-ui/react";
import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGatherQuery } from "../../hooks/gather/queries";
import HomeGatherCol from "./HomeGatherCol";

function HomeGatherSection() {
  const { data: gathers } = useGatherQuery(-1);

  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;

  const firstData = gathers?.slice(0, 6);
  const secondData = gathers?.slice(6, 12);
  console.log(gathers);
  return (
    <>
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
          <SlideSectionCol title="About 마감 임박 모임" subTitle="곧 마감! 마지막 기회">
            <HomeGatherCol gathers={shuffleArray(secondData?.slice(0, 3))} isPriority={false} />
          </SlideSectionCol>
          <SlideSectionCol title="About 마감 임박 모임" subTitle="지금 아니면 늦어요!">
            <HomeGatherCol gathers={shuffleArray(secondData?.slice(3, 6))} isPriority={false} />
          </SlideSectionCol>
        </motion.div>
      </AnimatePresence> */}

      <Box mx={5}>
        <SlideSectionCol title="번개 모임" subTitle="최근 가장 핫한 모임이에요!">
          <HomeGatherCol gathers={secondData?.slice(0, 3)} isPriority={false} />
        </SlideSectionCol>
      </Box>
    </>
  );
}

export default HomeGatherSection;
