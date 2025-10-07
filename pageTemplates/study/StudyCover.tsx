import styled from "styled-components";

import { STUDY_COVER_IMAGES } from "../../assets/images/studyCover";
import RoundedCoverImage from "../../components/atoms/RoundedCoverImage";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
import { getRandomImage } from "../../utils/imageUtils";

interface IStudyCover {
  studyType: StudyType;
  coverImage: string;
}

function StudyCover({ studyType, coverImage }: IStudyCover) {
  return (
    <StudyCoverWrapper>
      <RoundedCoverImage
        imageUrl={
          studyType === "soloRealTimes"
            ? "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/2.%EC%8B%A4%EC%8B%9C%EA%B0%84-%EA%B3%B5%EB%B6%80-%EC%9D%B8%EC%A6%9D.png"
            : studyType === "participations"
            ? "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/1.%EC%8A%A4%ED%84%B0%EB%94%94-%EB%A7%A4%EC%B9%AD-%EB%9D%BC%EC%9A%B4%EC%A7%80.png"
            : coverImage || getRandomImage(STUDY_COVER_IMAGES)
        }
      />
    </StudyCoverWrapper>
  );
}

const StudyCoverWrapper = styled.div`
  position: relative;
`;

export default StudyCover;
