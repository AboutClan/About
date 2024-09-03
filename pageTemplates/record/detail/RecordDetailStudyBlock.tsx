import { Fragment } from "react";
import styled from "styled-components";

import { LOCATION_TO_COLOR } from "../../../constants/location";
import { PLACE_TO_NAME } from "../../../constants/serviceConstants/studyConstants/studyCafeNameConstants";
import { PLACE_TO_LOCATION } from "../../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { Location } from "../../../types/services/locationTypes";
import { ISortedLocationStudies } from "./RecordDetail";

interface IRecordDetailStudyBlock {
  locationStudies: ISortedLocationStudies;
}

function RecordDetailStudyBlock({ locationStudies }: IRecordDetailStudyBlock) {
  return (
    <Container>
      {locationStudies.places.map((arrivedInfoList, idx) => {
        const placeId = arrivedInfoList.placeId;
        const location = PLACE_TO_LOCATION[placeId];
        return (
          <PlaceInfo key={idx} location={location}>
            <PlaceName>
              <span>{PLACE_TO_NAME[placeId]}</span>
              <OpenLocation location={location}>{location}</OpenLocation>
            </PlaceName>
            {arrivedInfoList?.arrivedInfo.length > 0 && (
              <MemberWrapper>
                {arrivedInfoList.arrivedInfo.map((user, idx2) => (
                  <Fragment key={idx2}>
                    {idx2 < 4 && <Member>{user.name.slice(-2)}</Member>}
                    {idx2 === 4 && (
                      <i
                        className="fa-regular fa-ellipsis fa-sm"
                        style={{ color: "var(--gray-600)" }}
                      />
                    )}
                  </Fragment>
                ))}
              </MemberWrapper>
            )}
          </PlaceInfo>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const PlaceInfo = styled.div<{ location: Location }>`
  width: 148px;
  flex-shrink: 0;
  margin-bottom: var(--gap-4);
  border: ${(props) => `1px solid ${LOCATION_TO_COLOR[props.location]}`};

  border-radius: var(--rounded-lg);
  padding: var(--gap-2);
  margin-right: var(--gap-2);
`;

const PlaceName = styled.div`
  display: flex;
  align-items: center;

  > span:first-child {
    font-size: 13px;
    font-weight: 600;
    margin-right: var(--gap-2);
  }
`;

const OpenLocation = styled.span<{ location: Location }>`
  font-size: 11px;
  color: ${(props) => LOCATION_TO_COLOR[props.location]};
`;

const MemberWrapper = styled.div`
  margin-top: var(--gap-3);
  display: flex;
  align-items: center;
`;

const Member = styled.span`
  margin-right: var(--gap-1);
  color: var(--gray-600);
  font-size: 13px;
`;

export default RecordDetailStudyBlock;
