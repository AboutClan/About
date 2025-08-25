import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { GATHER_TYPES,GatherCategoryIcons } from "../../../constants/contentsText/GatherContents";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import { ModalLayout } from "../../../modals/Modals";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherType } from "../../../types/models/gatherTypes/gatherTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

function WritingGatherCategory() {
  const router = useRouter();
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const failToast = useFailToast();

  const [gatherWriting, setGatherWriting] = useRecoilState(sharedGatherWritingState);
  const [gatherType, setGatherType] = useState<IGatherType>(gatherWriting?.type);
  const [isStudyModal, setIsStudyModal] = useState(false);

  useEffect(() => {
    if (gatherType) {
      const idx = GATHER_TYPES.findIndex((type) => type.title === gatherType.title);
      const target = refs.current[idx];

      const timeout = setTimeout(() => {
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [gatherType]);

  const onClickNext = () => {
    if (!gatherType) {
      failToast("free", "주제를 선택해 주세요!");
      return;
    }
    if (gatherType.title === "스터디") {
      setIsStudyModal(true);
      return;
    }
    handleNext();
  };

  const handleNext = () => {
    setGatherWriting((old) => ({ ...old, type: gatherType }));
    router.push({ pathname: `/gather/writing/content`, query: router.query });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={16} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>어떤 모임을 열고 싶나요?</span>
          <span>주제에 맞는 카테고리를 선택해 주세요</span>
        </RegisterOverview>
        <Flex flexDir="column">
          {GATHER_TYPES.map((type, idx) => (
            <Flex
              key={idx}
              align="center"
              ref={(el) => (refs.current[idx] = el)}
              p={4}
              py={3}
              border={
                type.title === gatherType?.title ? "var(--border-mint)" : "var(--border-main)"
              }
              borderRadius="8px"
              onClick={() => setGatherType(type)}
              mb={2}
            >
              <Flex justify="center" align="center" w="20px" mr={5} fontSize="15px" color="red.400">
                {GatherCategoryIcons[idx]}
              </Flex>
              <Flex flexDir="column">
                <Box fontSize="14px" color="gray.800" fontWeight="semibold">
                  {type.title}
                </Box>
                <Box fontSize="12px" color="gray.500">
                  {type.subtitle}
                </Box>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} />
      {isStudyModal && (
        <ModalLayout
          title="스터디 번개 개설"
          footerOptions={{
            main: {
              text: "스터디로 개설",
              func: () => {
                router.push(`/studyPage?date=${dayjsToStr(dayjs())}&drawer=on`);
              },
            },
            sub: {
              text: "번개로 개설",
              func: () => {
                handleNext();
              },
            },
          }}
          setIsModal={setIsStudyModal}
        >
          <p>
            단순 카공 모임은 <b>[스터디]</b>에서 개설할 수 있어요. 추가 콘텐츠가 있는 경우만 번개로
            개설해 주세요!
          </p>
        </ModalLayout>
      )}
    </>
  );
}

export default WritingGatherCategory;
