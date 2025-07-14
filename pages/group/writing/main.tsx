import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import {
  GATHER_TYPES,
  GatherCategoryIcons,
  GatherCategoryMain,
} from "../../../constants/contentsText/GatherContents";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IGroupWriting } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";
function WritingStudyCategoryMain() {
  const failToast = useFailToast();
  const router = useRouter();
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const [category, setCategory] = useState<GatherCategoryMain>(groupWriting?.category?.main);

  useEffect(() => {
    if (category) {
      const idx = GATHER_TYPES.findIndex((type) => type.title === category);
      const target = refs.current[idx];
      const timeout = setTimeout(() => {
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [category]);

  const onClickNext = () => {
    if (!category) {
      failToast("free", "주제를 선택해 주세요!");
      return;
    }
    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupWriting,
      category: { ...groupWriting?.category, main: category },
    });
    router.push({ pathname: `/group/writing/guide`, query: router.query });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={14} />
        <Header isSlide={false} title="" />
      </Slide>

      <RegisterLayout>
        <RegisterOverview>
          <span>주제를 선택해 주세요.</span>
        </RegisterOverview>
        <Flex flexDir="column">
          {GATHER_TYPES.map((type, idx) => (
            <Flex
              key={idx}
              align="center"
              ref={(el) => (refs.current[idx] = el)}
              p={4}
              py={3}
              border={type.title === category ? "var(--border-mint)" : "var(--border-main)"}
              borderRadius="8px"
              onClick={() => setCategory(type.title)}
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

export default WritingStudyCategoryMain;
