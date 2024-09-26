import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { ALL_스터디인증 } from "../../constants/serviceConstants/studyConstants/studyPlaceConstants";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IParticipation, IPlace } from "../../types/models/studyTypes/studyDetails";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import PlaceSelectorSub from "../molecules/picker/PlaceSelectorSub";
interface IStudyVotePlacesPicker {
  setVotePlaces: DispatchType<IStudyVotePlaces>;
}

function StudyVotePlacesPicker({ setVotePlaces }: IStudyVotePlacesPicker) {
  const { id, date } = useParams<{ id: string; date: string }>();

  const location = PLACE_TO_LOCATION[id];

  const { data: studyVoteArr } = useStudyVoteQuery(date, location, false, false, {
    enabled: !!location && !!date,
  });
  const studyVote = studyVoteArr?.[0]?.participations;

  const [filteredStudy, setFilteredStudy] = useState<IParticipation[]>();

  useEffect(() => {
    if (studyVote) {
      setFilteredStudy(
        studyVote.filter((par) => par.place._id !== id && par.place.brand !== "자유 신청"),
      );
    }
  }, [studyVote]);

  const [subPlace, setSubPlace] = useState<IPlace[]>([]);

  useEffect(() => {
    if (!studyVote) return;
    const mainPlace = studyVote?.find((study) => study.place._id === id).place;
    const temp = [];
    const studySubArr = studyVote?.filter(
      (item) => item.place._id !== mainPlace._id && item.place._id !== ALL_스터디인증,
    );

    studySubArr?.forEach((item) => {
      const distance = getDistanceFromLatLonInKm(
        mainPlace?.latitude,
        mainPlace?.longitude,
        item.place.latitude,
        item.place.longitude,
      );
      if (distance < 2.5) temp.push(item.place);
    });
    setSubPlace(temp);
    const subPlaceIdArr = temp.map((place) => place._id);
    setFilteredStudy(() => {
      const sortedData = studySubArr.sort((a, b) => {
        const aIncluded = subPlaceIdArr.includes(a.place._id);
        const bIncluded = subPlaceIdArr.includes(b.place._id);
        if (aIncluded && !bIncluded) return -1;
        if (!aIncluded && bIncluded) return 1;
        return 0;
      });

      return sortedData;
    });
  }, [studyVote, id]);

  useEffect(() => {
    setVotePlaces((old) => ({
      ...old,
      subPlace: subPlace?.map((place) => place._id),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subPlace]);

  return (
    <Layout>
      <PlaceSelectorSub
        places={filteredStudy}
        selectPlaces={subPlace}
        setSelectPlaces={setSubPlace}
      />
      {location === "안양" && <Comment>Study with us</Comment>}
    </Layout>
  );
}

const Layout = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Comment = styled.div`
  flex: 0.4;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-size: 20px;
  font-weight: 600;
`;

export default StudyVotePlacesPicker;
