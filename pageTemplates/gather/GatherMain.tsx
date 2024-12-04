import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Slide from "../../components/layouts/PageSlide";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { useGatherQuery } from "../../hooks/gather/queries";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { setGatherDataToCardCol } from "../home/HomeGatherCol";

export default function GatherMain() {
  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>();

  const setTransferGatherData = useSetRecoilState(transferGatherDataState);
  const [gathers, setGathers] = useState<IGather[]>([]);
  const [cursor, setCursor] = useState(0);
  const loader = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const { data: gatherData, isLoading } = useGatherQuery(cursor);

  useEffect(() => {
    if (gatherData) {
      setGathers((old) => [...old, ...gatherData]);
      firstLoad.current = false;
    }
  }, [gatherData]);

  useEffect(() => {
    if (!gathers) return;
    setCardDataArr(
      setGatherDataToCardCol(gathers, 6, (gather: IGather) => setTransferGatherData(gather)),
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
          <MainLoadingAbsolute />
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
