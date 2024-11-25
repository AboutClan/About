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
      <CustomExternalLink color="var(--color-blue)" href={url} isblur={isBlur ? "true" : "false"}>
        {url}
      </CustomExternalLink>
    </BlurredPart>
  );
}

const CustomExternalLink = styled(ExternalLink)<{ isblur: "true" | "false" }>`
  pointer-events: ${({ isblur }) => (isblur === "true" ? "none" : "unset")};
`;

export default BlurredLink;
