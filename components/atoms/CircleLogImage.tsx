import Image from "next/image";
import styled from "styled-components";

interface ICircleLogImage {
  logoName: string;
  imageUrl: string;
}

export default function CircleLogoImage({ logoName, imageUrl }: ICircleLogImage) {
  return (
    <CircleLogoWrapper>
      <Image src={imageUrl} width={72} height={72} alt={logoName} />
    </CircleLogoWrapper>
  );
}

const CircleLogoWrapper = styled.div`
  border: var(--border-main);
  background-color: var(--gray-300);
  border-radius: 50%;
  overflow: hidden;
  position: relative;
`;
