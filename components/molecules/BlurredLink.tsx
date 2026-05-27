import styled from "styled-components";

import BlurredPart from "./BlurredPart";
import ExternalLink from "./ExternalLink";

interface BlurredLinkProps {
  isBlur: boolean;
  url: string;
}

function BlurredLink({ isBlur, url }: BlurredLinkProps) {
  return (
    <BlurredPart isBlur={isBlur} isCenter={false}>
      <div
        style={{
          width: "100%",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          overflow: "hidden",
          wordBreak: "break-all",
        }}
      >
        <CustomExternalLink color="var(--color-blue)" href={url} isblur={isBlur ? "true" : "false"}>
          {url}
        </CustomExternalLink>
      </div>
    </BlurredPart>
  );
}

const CustomExternalLink = styled(ExternalLink)<{ isblur: "true" | "false" }>`
  pointer-events: ${({ isblur }) => (isblur === "true" ? "none" : "unset")};
  user-select: ${({ isblur }) => (isblur === "true" ? "none" : "text")};
`;

export default BlurredLink;
