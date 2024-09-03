import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import ButtonGroups from "../../components/molecules/groups/ButtonGroups";
import { LOCATION_OPEN, LOCATION_TO_COLOR, LOCATION_TO_FULLNAME } from "../../constants/location";
import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { ALL_스터디인증 } from "../../constants/serviceConstants/studyConstants/studyPlaceConstants";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IArrivedData } from "../../types/models/studyTypes/studyRecords";
import { ActiveLocationAll } from "../../types/services/locationTypes";

interface IRecordLocationCategory {
  initialData: IArrivedData[];
  setFilterData: DispatchType<IArrivedData[]>;
}

function RecordLocationCategory({ initialData, setFilterData }: IRecordLocationCategory) {
  const [category, setCategory] = useState<ActiveLocationAll>("전체");

  useEffect(() => {
    if (!initialData) return;
    if (category === "전체") setFilterData(initialData);
    else {
      const filtered = initialData.map((item) => {
        const filteredArrived = item?.arrivedInfoList.filter(
          (place) =>
            place?.placeId !== ALL_스터디인증 && PLACE_TO_LOCATION[place?.placeId] === category,
        );
        if (!filteredArrived) return;
        return { ...item, arrivedInfoList: filteredArrived };
      });
      setFilterData(filtered);
    }
  }, [category, initialData, setFilterData]);

  const buttonOptionsArr = (["전체", ...LOCATION_OPEN] as ActiveLocationAll[]).map((location) => ({
    text: LOCATION_TO_FULLNAME[location] || "전체",
    func: () => {
      if (location === category) setCategory("전체");
      else setCategory(location);
    },
    color: LOCATION_TO_COLOR[location],
  }));

  return (
    <Box
      py={1}
      pl={2}
      borderTop="var(--border)"
      borderBottom="var(--border)"
      bgColor="var(--gray-200)"
    >
      <ButtonGroups
        buttonOptionsArr={buttonOptionsArr}
        currentValue={LOCATION_TO_FULLNAME[category]}
        type="text"
        isWrap
      />
    </Box>
  );
}

export default RecordLocationCategory;
