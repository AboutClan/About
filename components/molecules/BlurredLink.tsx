import styled from "styled-components";

import BlurredPart from "./BlurredPart";
import ExternalLink from "./ExternalLink";

interface BlurredLinkProps {
  isBlur: boolean;
  url: string;
}

function BlurredLink({ isBlur, url }: BlurredLinkProps) {
  return (
    <KakaoLink>
      <span>오픈채팅방 주소(참여 인원 전용)</span>
      <div>
        <BlurredPart isBlur={isBlur} isCenter={false}>
          <CustomExternalLink href={url} isBlur={isBlur}>
            {url}
          </CustomExternalLink>
        </BlurredPart>
      </div>
    </KakaoLink>
  );
}

const KakaoLink = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--gap-2) var(--gap-3);
  padding-bottom: var(--gap-1);
  background-color: var(--gray-100);

  > div {
    padding: var(--gap-1) 0;
  }
`;

const CustomExternalLink = styled(ExternalLink)<{ isBlur: boolean }>`
  pointer-events: ${({ isBlur }) => (isBlur ? "none" : "unset")};
`;

export default BlurredLink;
