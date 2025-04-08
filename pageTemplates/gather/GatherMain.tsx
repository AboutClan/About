import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Select from "../../components/atoms/Select";
import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import Slide from "../../components/layouts/PageSlide";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import ButtonGroups from "../../components/molecules/groups/ButtonGroups";
import { useGatherQuery } from "../../hooks/gather/queries";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { setGatherDataToCardCol } from "../home/HomeGatherCol";
import GatherSkeletonMain from "./GatherSkeletonMain";

export default function GatherMain() {
  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>();

  const setTransferGatherData = useSetRecoilState(transferGatherDataState);
  const [gathers, setGathers] = useState<IGather[]>([]);
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const [category, setCategory] = useState<"취미" | "스터디" | null>(null);
  const [sortBy, setSortBy] = useState<"날짜순" | "등록일순">("등록일순");

  const { data: gatherData, isLoading } = useGatherQuery(
    cursor,
    category,
    sortBy === "등록일순" ? "createdAt" : "date",
  );
  useEffect(() => {
    setGathers([]);
    setCursor(0);
  }, [category, sortBy]);

  useEffect(() => {
    if (gatherData) {
      setGathers((old) => [...old, ...gatherData]);
      firstLoad.current = false;
    }
  }, [gatherData]);

  useEffect(() => {
    if (!gathers) return;
    setCardDataArr(
      setGatherDataToCardCol(gathers, true, (gather: IGather) => setTransferGatherData(gather)),
    );
  }, [gathers, location]);

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
    <Slide>
      <Flex py={1} mb={2} justify="space-between" align="center">
        <ButtonGroups
          buttonOptionsArr={(["취미", "스터디"] as ("취미" | "스터디")[]).map((prop) => ({
            icon: <CheckCircleIcon color={category === prop ? "black" : "gray"} size="sm" isFill />,
            text: prop,
            func: () => setCategory(category === prop ? null : prop),
            color: "black",
          }))}
          currentValue={category}
          isEllipse
          size="md"
        />
        <Select
          size="sm"
          isThick
          defaultValue={sortBy}
          options={["등록일순", "날짜순"]}
          setValue={setSortBy}
        />
      </Flex>
      <Box position="relative" minH="320px">
        {cardDataArr?.length ? (
          <>
            {cardDataArr.map((cardData, idx) => (
              <Box mb="12px" key={idx}>
                <GatherThumbnailCard {...cardData} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map((cardData, idx) => (
              <Box mb="12px" key={idx}>
                <GatherSkeletonMain />
              </Box>
            ))}
          </>
        )}
        <div ref={loader} />
        {isLoading && cardDataArr?.length ? (
          <Box position="relative" mt="32px">
            <MainLoadingAbsolute size="sm" />
          </Box>
        ) : undefined}
      </Box>
    </Slide>
  );
}
