import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ButtonGroups, { ButtonOptionsProps } from "../../components/molecules/groups/ButtonGroups";
import { LOCATION_TO_FULLNAME } from "../../constants/location";
import { ActiveLocation, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { createUrlWithLocation } from "../../utils/convertUtils/convertTypes";

export default function GatherLocationFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultLocation = convertLocationLangTo(
    searchParams.get("location") as LocationEn,
    "kr",
  ) as ActiveLocation;

  const [location, setLocation] = useState<ActiveLocation | "전체">(defaultLocation || "전체");
 
  useEffect(() => {
    if (defaultLocation) setLocation(defaultLocation);
  }, [defaultLocation]);

  const onClickButton = (locationType: ActiveLocation | "전체") => {
    setLocation(locationType);
    const url =
      locationType === "전체"
        ? "/gather"
        : createUrlWithLocation("/gather", convertLocationLangTo(locationType, "en"));
    router.replace(url);
  };

  const buttonOptionsArr: ButtonOptionsProps[] = [
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
    {
      text: "인천",
      func: () => onClickButton("인천"),
    },
  ];

  return (
    <Box p="12px 16px" pr="0">
      <ButtonGroups
        buttonOptionsArr={buttonOptionsArr
          .map((prop) =>
            prop.text === "전체"
              ? prop
              : { text: LOCATION_TO_FULLNAME[prop.text], func: prop.func },
          )
          .sort((x, y) => {
            if (x.text === "전체") return -1;
            if (y.text === "전체") return 1;
            if (x.text === defaultLocation) return -1;
            if (y.text === defaultLocation) return 1;
            return x.text.localeCompare(y.text);
          })}
        currentValue={location === "전체" ? "전체" : LOCATION_TO_FULLNAME[location]}
        size="md"
      />
    </Box>
  );
}
