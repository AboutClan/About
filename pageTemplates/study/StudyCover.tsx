import styled from "styled-components";

import CircleLogoImage from "../../components/atoms/CircleLogImage";
import RoundedCoverImage from "../../components/atoms/RoundedCoverImage";
import { STUDY_CAFE_LOGO } from "../../constants/serviceConstants/studyConstants/studyCafeLogoConstants";

interface IStudyCover {
  brand: string;
  imageUrl: string;
  isPrivateStudy: boolean;
}

function StudyCover({ brand, imageUrl, isPrivateStudy }: IStudyCover) {
  const brandName = brand === "행궁 81.2" ? "행궁" : isPrivateStudy ? "개인스터디" : brand;
  const logo = STUDY_CAFE_LOGO[brandName];

  return (
    <StudyCoverWrapper>
      <RoundedCoverImage imageUrl={imageUrl} />
      <LogoWrapper>
        <CircleLogoImage logoName={brand} imageUrl={logo} />
      </LogoWrapper>
    </StudyCoverWrapper>
  );
}

const StudyCoverWrapper = styled.div`
  position: relative;
`;

const LogoWrapper = styled.div`
  border-radius: 50%;
  background-color: white;
  position: absolute;
  right: 24px;
  bottom: -32px;
  z-index: 10;
`;
export default StudyCover;
