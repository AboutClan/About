import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import styled from "styled-components";

import { SingleLineText } from "../../styles/layout/components";

export interface SummaryBlockProps {
  url: string;
  title: string;
  text: string;
}

function SummaryBlock({ url, title, text }: SummaryBlockProps) {
  return (
    <Link href={url} style={{ width: "100%" }}>
      <Flex p="10px " bgColor="white" borderRadius="var(--rounded-lg)" border="var(--border-main)">
        <Flex justify="center" align="center" p="8px" mr="10px">
          <i className="fa-solid fa-magnifying-glass fa-lg" style={{ color: "var(--gray-500)" }} />
        </Flex>
        <Flex h="inherit" direction="column" justify="space-around">
          <Box fontWeight={600} fontSize="13px">
            {title}
          </Box>
          <Box
            fontSize="12px"
            color="var(--gray-600)"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "1",
              overflow: "hidden",
            }}
          >
            {text}
          </Box>
        </Flex>
      </Flex>
    </Link>
  );
}

const LocationText = styled(SingleLineText)`
  margin-left: 4px;

  width: 100px;
`;
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  width: 44px;
  margin-right: var(--gap-2);
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  > span:first-child {
    font-weight: 600;
    font-size: 13px;
  }
`;

export default SummaryBlock;
