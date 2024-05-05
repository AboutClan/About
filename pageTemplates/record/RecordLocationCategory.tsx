import { useEffect, useState } from "react";
import styled from "styled-components";
<<<<<<< HEAD
import {
  LOCATION_CONVERT,
  LOCATION_OPEN,
  LOCATION_TABLE_COLOR,
} from "../../constants/location";
import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";

=======

import { LOCATION_CONVERT, LOCATION_OPEN, LOCATION_TABLE_COLOR } from "../../constants/location";
import { PLACE_TO_LOCATION } from "../../storage/study";
>>>>>>> main
import { DispatchType } from "../../types/hooks/reactTypes";
import { IArrivedData } from "../../types/models/studyTypes/studyRecords";
import { Location, LocationFilterType } from "../../types/services/locationTypes";

interface IRecordLocationCategory {
  initialData: IArrivedData[];
  setFilterData: DispatchType<IArrivedData[]>;
}

function RecordLocationCategory({ initialData, setFilterData }: IRecordLocationCategory) {
  const [category, setCategory] = useState<LocationFilterType>("전체");

  const onClickBadge = (value: Location) => {
    if (value === category) setCategory("전체");
    else setCategory(value);
  };

  useEffect(() => {
    if (!initialData) return;
    if (category === "전체") setFilterData(initialData);
    else {
      const filtered = initialData.map((item) => {
        const filteredArrived = item?.arrivedInfoList.filter(
          (place) => PLACE_TO_LOCATION[place?.placeId] === category,
        );
        if (!filteredArrived) return;
        return { ...item, arrivedInfoList: filteredArrived };
      });
      setFilterData(filtered);
    }
  }, [category, initialData, setFilterData]);

  return (
    <Layout>
      <SpaceBadge>
        {LOCATION_OPEN.map((location) => (
          <Button
            key={location}
            location={location}
            category={category}
            onClick={() => onClickBadge(location)}
          >
            {LOCATION_CONVERT[location]}
          </Button>
        ))}
      </SpaceBadge>
    </Layout>
  );
}

const Layout = styled.div`
  padding: 0 var(--gap-4);
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--gray-7);
  border-top: 1px solid var(--gray-6);
  border-bottom: 1px solid var(--gray-6);
  > div {
    display: flex;
    align-items: center;
  }
  > span:last-child {
    font-size: 10px;
    color: var(--gray-3);
  }
`;

const SpaceBadge = styled.section`
  display: flex;
  align-items: center;
`;

const Button = styled.button<{
  location: Location;
  category: LocationFilterType;
}>`
  margin-right: var(--gap-3);
  font-weight: 600;
  color: ${(props) => LOCATION_TABLE_COLOR[props.location]};
  font-size: ${(props) => (props.category === props.location ? "14px" : "12px")};
  opacity: ${(props) =>
    props.category !== "전체" && props.category !== props.location ? "0.7" : "1"};
`;

export default RecordLocationCategory;
