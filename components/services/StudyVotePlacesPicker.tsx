import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";

import { useStudyVoteQuery } from "../../hooks/study/queries";

import { DispatchType } from "../../types/hooks/reactTypes";
import { IPlace } from "../../types/models/studyTypes/studyDetails";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import PlaceSelectorSub from "../molecules/picker/PlaceSelectorSub";

interface IStudyVotePlacesPicker {
  onClick: () => void;
  setVotePlaces: DispatchType<IStudyVotePlaces>;
}

function StudyVotePlacesPicker({
  onClick,
  setVotePlaces,
}: IStudyVotePlacesPicker) {
  const { id, date } = useParams<{ id: string; date: string }>();

  const location = PLACE_TO_LOCATION[id];

  const { data: studyVote } = useStudyVoteQuery(date, location, {
    enabled: !!location && !!date,
  });

  const filteredStudy = studyVote?.filter(
    (par) => par.place._id !== id && par.place.brand !== "자유 신청"
  );

  const [subPlace, setSubPlace] = useState<IPlace[]>([]);

  useEffect(() => {
    setVotePlaces((old) => ({
      ...old,
      subPlace: subPlace.map((place) => place._id),
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
  color: var(--gray-2);
`;

export default StudyVotePlacesPicker;
