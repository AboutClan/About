import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Select from "../../../components/atoms/Select";
import { StudyThumbnailCardProps } from "../../../components/molecules/cards/StudyThumbnailCard";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { DispatchType } from "../../../types/hooks/reactTypes";

interface StudyPageDrawerFilterBarProps {
  placeCnt: number;
  thumbnailCardInfoArr: StudyThumbnailCardProps[];
  setThumbnailCardInfoArr: DispatchType<StudyThumbnailCardProps[]>;
}

type SelectOption = "인원순" | "거리순" | "선호순";

function StudyPageDrawerFilterBar({
  placeCnt,
  thumbnailCardInfoArr,
  setThumbnailCardInfoArr,
}: StudyPageDrawerFilterBarProps) {
  const [selectOption, setSelectOption] = useState<SelectOption>("거리순");

  const { data: userInfo } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;

  useEffect(() => {
    if (!thumbnailCardInfoArr || (selectOption === "선호순" && !preference?.place)) return;
    setThumbnailCardInfoArr((old) => {
      return [...old].sort((a, b) => {
        if (selectOption === "거리순") {
          if (a.place.distance > b.place.distance) return 1;
          else if (a.place.distance < b.place.distance) return -1;
          else return 0;
        }
        if (selectOption === "인원순") {
          if (a.participants.length > b.participants.length) return -1;
          if (a.participants.length < b.participants.length) return 1;
          return 0;
        }
        if (selectOption === "선호순") {
          if (preference.place === a.id || preference.place === b.id) return -1;
          else if (preference.subPlace?.includes(a.id) || preference.subPlace?.includes(b.id))
            return -1;
          else return 1;
        }
      });
    });
  }, [selectOption, preference]);

  const selectOptionArr = ["인원순", "거리순", "선호순"];

  return (
    <Flex justify="space-between" my="13.5px">
      <Box fontSize="12px">
        전체 <b style={{ color: "var(--color-mint)" }}>{placeCnt}개</b>
      </Box>
      <Select
        options={selectOptionArr}
        defaultValue={selectOption}
        size="sm"
        setValue={setSelectOption}
        isBorder={false}
      />
    </Flex>
  );
}

export default StudyPageDrawerFilterBar;
