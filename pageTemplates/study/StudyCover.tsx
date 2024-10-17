import styled from "styled-components";

import RoundedCoverImage from "../../components/atoms/RoundedCoverImage";

interface IStudyCover {
  coverImage: string;
}

function StudyCover({ coverImage }: IStudyCover) {
  return (
    <StudyCoverWrapper>
      <RoundedCoverImage imageUrl={coverImage} />
    </StudyCoverWrapper>
  );
}

const StudyCoverWrapper = styled.div`
  position: relative;
`;

export default StudyCover;
