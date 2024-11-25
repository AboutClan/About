import Image from "next/image";
import styled from "styled-components";

interface ICircleLogImage {
  logoName: string;
  imageUrl: string;
}

export default function CircleLogoImage({ logoName, imageUrl }: ICircleLogImage) {
  return (
    <CircleLogoWrapper>
      <Image src={imageUrl} fill={true} sizes="100px" alt={logoName} />
    </CircleLogoWrapper>
  );
}

const CircleLogoWrapper = styled.div`
  border: var(--border-main);
  background-color: var(--gray-200);
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  width: 72px;
  height: 72px;
`;
