import Image from "next/image";
import styled from "styled-components";

interface IRoundedCoverImage {
  imageUrl: string;
}
export default function RoundedCoverImage({ imageUrl }: IRoundedCoverImage) {
  return (
    <RoundedImageWrapper>
      <div>
        <Image src={imageUrl} fill={true} sizes="400px" alt="study" priority={true} />
      </div>
    </RoundedImageWrapper>
  );
}
const RoundedImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  border-bottom-left-radius: var(--rounded-max);
  border-bottom-right-radius: var(--rounded-max);

  > div {
    position: relative;
    width: 100%;
    height: 100%;
  }
`;
