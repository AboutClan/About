import { AnimatePresence, motion } from "framer-motion";

import SlideSectionCol from "../../components/molecules/SlideSectionCol";
import { useWindowWidth } from "../../hooks/custom/CustomHooks";
import { useGatherQuery } from "../../hooks/gather/queries";
import HomeGatherCol from "./HomeGatherCol";

// 공식 행사로 노출할 모임 id를 원하는 순서대로 나열하면 그 순서대로 2x3 배치됩니다.
// 비워두면 첫번째 섹션 후보(officialGather/openGather/secretGather) 중 기본 순서로 6개를 사용합니다.
const FEATURED_GATHER_ID_ORDER: number[] = [5120, 5141, 5118, 5132, 5142, 5135];

const FEATURED_CATEGORIES = ["officialGather", "openGather", "secretGather", "gather2"];

function HomeGatherSection() {
  const { data: gathers } = useGatherQuery(-1);
  const windowWidth = useWindowWidth(); // 현재 화면 너비 가져오기
  const width = windowWidth - 70;
  console.log(4, gathers);
  // 첫번째 섹션(공식 행사)에는 officialGather/openGather/secretGather만 노출된다.
  const featuredPool = gathers?.filter(
    (gather) => gather && FEATURED_CATEGORIES.includes(gather.category),
  );

  console.log(3, featuredPool);
  const featuredData = FEATURED_GATHER_ID_ORDER.length
    ? FEATURED_GATHER_ID_ORDER.map((id) =>
        featuredPool?.find((gather) => gather?.id === id),
      ).filter((gather) => !!gather)
    : featuredPool?.slice(0, 6);

  // 이후 섹션에서는 앞선 섹션에 이미 노출된 모임을 제외하고 채운다.
  const usedIds = new Set(featuredData?.map((gather) => gather?.id));

  const upcomingData = gathers?.slice(3, 9)?.filter((gather) => gather && !usedIds.has(gather.id));
  upcomingData?.forEach((gather) => usedIds.add(gather.id));

  const recentData = gathers?.slice(9, 15)?.filter((gather) => gather && !usedIds.has(gather.id));

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
            title="🔥 놓치면 후회하는 About 공식 행사"
            subTitle="오픈 번개 & 정규모임, 지금 바로 신청하세요!"
          >
            <HomeGatherCol
              gathers={featuredData?.slice(0, 3)?.filter((data) => !!data)}
              isPriority
            />
          </SlideSectionCol>
          <SlideSectionCol
            title="🔥 놓치면 후회하는 About 공식 행사"
            subTitle="오픈 번개 & 정규모임, 지금 바로 신청하세요!"
          >
            <HomeGatherCol
              gathers={featuredData?.slice(3, 6)?.filter((data) => !!data)}
              isPriority
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
      {recentData?.length >= 6 && (
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
      )}
    </>
  );
}

export default HomeGatherSection;
