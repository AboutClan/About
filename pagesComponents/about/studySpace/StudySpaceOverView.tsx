import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled from "styled-components";
import SpaceMap from "../../../components/utils/SpaceMap";
import { STUDY_SPACE_INFO } from "../../../storage/study";
import { IPlace } from "../../../types/studyDetails";

interface IStudySpaceOverview {
  space: IPlace;
}

function StudySpaceOverview({ space }: IStudySpaceOverview) {
  const location = STUDY_SPACE_INFO?.find((info) => info.id === space._id);
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <Layout>
        <span>
          {space.brand}
          {space.branch !== "수원시청역" ? space.branch : "나혜석거리점"}
        </span>
        <SpaceDetail>
          <Location>
            위치: <span>{location.location}</span>
            <div onClick={() => setIsModal(true)}>
              <FontAwesomeIcon icon={faLocationDot} size="sm" />
              <span>지도</span>
            </div>
          </Location>

          <Time>
            시간: <span>{location.time}</span>
          </Time>
        </SpaceDetail>
      </Layout>
      {isModal && (
        <MapWrapper>
          <MapBtn onClick={() => setIsModal(false)}>X</MapBtn>
          <SpaceMap lat={space.latitude} lon={space.longitude} />
        </MapWrapper>
      )}
    </>
  );
}

const Layout = styled.div`
  margin-top: 36px;
  padding-bottom: 18px;
  > span:first-child {
    font-weight: 600;
    font-size: 18px;
  }
  > div:first-child {
    margin-left: 20px;
  }
`;

const SpaceDetail = styled.div`
  color: var(--font-h2);
  font-size: 12px;
  font-weight: 600;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  > span {
    > span {
      margin-left: 4px;
    }
  }
`;
const Location = styled.span`
  display: flex;
  > span {
    color: var(--font-h1);
    margin-right: 12px;
  }
  > div {
    > span:last-child {
      margin-left: 2px;
    }
  }
`;
const Time = styled.span`
  > span {
    color: var(--font-h1);
  }
`;

const MapWrapper = styled.div`
  position: relative;
`;

const MapBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--font-h7);
  width: 40px;
  font-size: 18px;
  font-weight: 600;
  height: 40px;
  z-index: 100;
`;

export default StudySpaceOverview;