import Link from "next/link";
import styled from "styled-components";

import { Size } from "../../types/components/assetTypes";
export interface IIconLinkTile {
  text: string;
  icon: React.ReactNode;
  size?: Size;
  url?: string;
  func?: () => void;
}

export default function IconLinkTile({ url, text, icon, func, size = "md" }: IIconLinkTile) {
  const renderContent = () => (
    <>
      <IconContainer>{icon}</IconContainer>
      <Text size={size}>{text}</Text>
    </>
  );

  return (
    <>
      {url ? (
        <StyledLink href={url}>{renderContent()}</StyledLink>
      ) : (
        <StyledButton onClick={func}>{renderContent()}</StyledButton>
      )}
    </>
  );
}

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;

  text-decoration: none; /* Link에 기본적으로 적용되는 스타일 제거 */
`;

const StyledButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer = styled.div`
  margin-bottom: 8px; /* mb-3에 해당하는 마진 값 */
`;

const Text = styled.span`
  white-space: nowrap;
  font-size: ${(props) =>
    props.size === "lg" ? "14px" : "10px"}; /* text-xs와 text-sm에 해당하는 폰트 크기 */
  font-weight: normal;
`;
