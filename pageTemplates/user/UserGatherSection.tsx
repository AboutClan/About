import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useGatherMyStatusQuery } from "../../hooks/gather/queries";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import GatherSkeletonMain from "../gather/GatherSkeletonMain";
import { setGatherDataToCardCol } from "../home/HomeGatherCol";
import UserGatherSectionReview from "./UserGatherSectionReview";

type GatherType = "참여중인 모임" | "종료된 모임" | "내가 개설한 모임";

function UserGatherSection() {
  const typeToast = useTypeToast();
  const [gatherType, setGatherType] = useState<GatherType>("참여중인 모임");
  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>();
  const [gathers, setGathers] = useState<IGather[]>([]);
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const { data: gatherData, isLoading } = useGatherMyStatusQuery(cursor);
  console.log(gatherData);
  useEffect(() => {
    setGathers([]);
    setCursor(0);
    setCardDataArr([]);
  }, [gatherType]);

  useEffect(() => {
    if (gatherData?.length) {
      setGathers((old) => [...old, ...gatherData]);
      firstLoad.current = false;
    }
  }, [gatherData, cursor]);

  useEffect(() => {
    if (!gathers?.length) return;

    setCardDataArr(setGatherDataToCardCol(gathers, true));
  }, [gathers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !firstLoad.current) {
          setCursor((prevCursor) => prevCursor + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  return (
    <Box mx={5} pb={10}>
      <UserGatherSectionReview />
      <Box position="relative" minH="1000px">
        {cardDataArr?.length ? (
          <>
            {cardDataArr.map((cardData, idx) => (
              <Box mb="12px" key={idx}>
                <GatherThumbnailCard {...cardData} />
              </Box>
            ))}
          </>
        ) : isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <Box mb="12px" key={idx}>
                <GatherSkeletonMain />
              </Box>
            ))}
          </>
        ) : (
          <Flex
            justify="center"
            align="center"
            fontSize="14px"
            fontWeight="medium"
            bg="gray.100"
            px={3}
            py={4}
            minH="114px"
            borderRadius="8px"
            color="gray.600"
            border="var(--border)"
          >
            {gatherType === "참여중인 모임"
              ? " 현재 참여중인 모임이 없습니다."
              : gatherType === "종료된 모임"
              ? "과거 참여한 모임이 없습니다."
              : "개설한 모임이 없습니다."}
          </Flex>
        )}
      </Box>
      <div ref={loader} />
      {isLoading && cardDataArr?.length ? (
        <Box position="relative" mt="32px">
          <MainLoadingAbsolute size="sm" />
        </Box>
      ) : undefined}
    </Box>
  );
}

export default UserGatherSection;
