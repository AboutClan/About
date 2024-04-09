import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ButtonGroups from "../../components/molecules/groups/ButtonGroups";
import { ActiveLocation, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { createUrlWithLocation } from "../../utils/convertUtils/convertTypes";

export default function GatherLocationFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultLocation = convertLocationLangTo(
    searchParams.get("location") as LocationEn,
    "kr"
  );

  const [location, setLocation] = useState<ActiveLocation | "전체">(
    defaultLocation || "전체"
  );

  const onClickButton = (locationType: ActiveLocation | "전체") => {
    setLocation(locationType);
    const url =
      locationType === "전체"
        ? "/gather"
        : createUrlWithLocation(
            "/gather",
            convertLocationLangTo(locationType, "en")
          );
    router.replace(url);
  };

  const buttonDataArr = [
    {
      text: "전체",
      func: () => onClickButton("전체"),
    },
    {
      text: "수원",
      func: () => onClickButton("수원"),
    },
    {
      text: "양천",
      func: () => onClickButton("양천"),
    },
    {
      text: "강남",
      func: () => onClickButton("강남"),
    },
    {
      text: "안양",
      func: () => onClickButton("안양"),
    },
    {
      text: "동대문",
      func: () => onClickButton("동대문"),
    },
  ];

  return (
    <Box>
      <ButtonGroups buttonDataArr={buttonDataArr} currentValue={location} />
    </Box>
  );
}
