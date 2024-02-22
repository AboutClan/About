import styled from "styled-components";
import Slide from "../components/layout/PageSlide";
import ArrowBackButton from "./atoms/buttons/ArrowBackButton";
interface IHeader {
  title: string;
  url?: string;
  isSlide?: boolean;
  children?: React.ReactNode;
}

export default function Header({
  title,
  isSlide = true,
  url,
  children,
}: IHeader) {
  const HeaderLayout = () => (
    <HeaderContainer>
      <LeftSection>
        <ArrowBackButton url={url} />
        <Title>{title}</Title>
      </LeftSection>
      <div>{children}</div>
    </HeaderContainer>
  );

  return (
    <>
      {isSlide ? (
        <Slide isFixed={true}>
          <HeaderLayout />
        </Slide>
      ) : (
        <HeaderLayout />
      )}
    </>
  );
}

const HeaderContainer = styled.header`
  background-color: white;
  height: var(--header-h);
  font-size: 16px;
  padding-right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border);
`;

// Left Section 스타일
const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

// Title 스타일
const Title = styled.div`
  font-weight: 800; /* font-extrabold */
  color: var(--gray-1); /* text-gray-1 - 색상은 예시입니다 */
`;
