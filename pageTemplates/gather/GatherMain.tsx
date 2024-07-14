import { Box } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import {
  IPostThumbnailCard,
  PostThumbnailCard,
} from "../../components/molecules/cards/PostThumbnailCard";
import { useGatherQuery } from "../../hooks/gather/queries";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { setGatherDataToCardCol } from "../home/HomeGatherCol";

export default function GatherMain() {
  const searchParams = useSearchParams();

  const location = convertLocationLangTo(searchParams.get("location") as LocationEn, "kr");
  const [cardDataArr, setCardDataArr] = useState<IPostThumbnailCard[]>();

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
      setGatherDataToCardCol(
        location
          ? gathers.filter((gather) => gather.place === "전체" || gather.place.includes(location))
          : gathers,
        (gather: IGather) => setTransferGatherData(gather),
      ),
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
    <Box m="0 16px">
      {cardDataArr && (
        <>
          {cardDataArr.map((cardData, idx) => (
            <Box mb="12px" key={idx}>
              <PostThumbnailCard postThumbnailCardProps={cardData} />
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
  );
}
