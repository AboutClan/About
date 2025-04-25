import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { GATHER_TYPES,GatherCategoryIcons } from "../../../constants/contentsText/GatherContents";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherType } from "../../../types/models/gatherTypes/gatherTypes";

function WritingGatherCategory() {
  const router = useRouter();

  const failToast = useFailToast();

  const [gatherWriting, setGatherWriting] = useRecoilState(sharedGatherWritingState);

  const [gatherType, setGatherType] = useState<IGatherType>(gatherWriting?.type);

  const onClickNext = () => {
    if (!gatherType) {
      failToast("free", "주제를 선택해 주세요!");
      return;
    }
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
          <span>자유롭게 주제를 선택해 주세요</span>
        </RegisterOverview>
        <Flex flexDir="column">
          {GATHER_TYPES.map((type, idx) => (
            <Flex
              key={idx}
              align="center"
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
    </>
  );
}

export default WritingGatherCategory;
