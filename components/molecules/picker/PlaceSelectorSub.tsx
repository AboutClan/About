import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";

import ImageTileGridLayout, {
  IImageTileData,
} from "../../../components/molecules/layouts/ImageTitleGridLayout";
import { MAX_USER_PER_PLACE } from "../../../constants/settingValue/study/study";
import { useToast } from "../../../hooks/custom/CustomToast";
import {
  StudyParticipationProps,
  StudyPlaceProps,
} from "../../../types/models/studyTypes/baseTypes";

interface IPlaceSelectorSub {
  places: StudyParticipationProps[];
  selectPlaces: StudyPlaceProps[];
  setSelectPlaces: Dispatch<SetStateAction<StudyPlaceProps[]>>;
}

function PlaceSelectorSub({ places, selectPlaces, setSelectPlaces }: IPlaceSelectorSub) {
  const toast = useToast();
  const isTwoPage = places?.length > 8;

  const [pagePlaces, setPagePlaces] = useState<{
    first: StudyParticipationProps[];
    second: StudyParticipationProps[];
  }>();
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (!places) return;
    setPagePlaces({
      first: places.slice(0, 8),
      second: places.slice(8),
    });
  }, [isTwoPage, places]);

  const onClick = (par: StudyParticipationProps) => {
    if (par.members.length >= MAX_USER_PER_PLACE) {
      toast("error", "인원이 마감되었습니다.");
      return;
    }
    const place = par.place;

    setSelectPlaces((old) => {
      if (old.includes(place)) return old.filter((item) => item !== place);
      return [...old, place];
    });
  };

  const onClickArrow = (type: "left" | "right") => {
    if (type === "left") setIsFirst(true);
    if (type === "right") setIsFirst(false);
  };

  const imageDataArr: IImageTileData[] = (isFirst ? pagePlaces?.first : pagePlaces?.second)?.map(
    (par) => ({
      imageUrl: par.place.image,
      text: par.place.branch,
      func: () => onClick(par),
      id: par.place._id,
    }),
  );

  return (
    <Layout isTwoPage={isTwoPage}>
      {imageDataArr && (
        <ImageTileGridLayout
          imageDataArr={imageDataArr}
          grid={{ row: 2, col: 4 }}
          selectedId={selectPlaces.map((place) => place._id)}
        />
      )}

      {!isFirst && (
        <LeftArrow onClick={() => onClickArrow("left")}>
          <i className="fa-solid fa-left" />
        </LeftArrow>
      )}
      {isTwoPage && isFirst && (
        <RightArrow onClick={() => onClickArrow("right")}>
          <i className="fa-solid fa-right" />
        </RightArrow>
      )}
    </Layout>
  );
}

const Layout = styled.div<{ isTwoPage: boolean }>`
  position: relative;
  height: 100%;
  padding: 12px 16px;
  padding-top: 4px;
`;

const LeftArrow = styled.div`
  padding: 8px;
  position: absolute;
  top: 38%;
  left: -12px;
`;
const RightArrow = styled.div`
  padding: 8px;
  position: absolute;
  top: 38%;
  right: -12px;
`;

export default PlaceSelectorSub;
