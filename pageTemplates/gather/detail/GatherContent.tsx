import { Box } from "@chakra-ui/react";
import styled from "styled-components";

import BlurredLink from "../../../components/molecules/BlurredLink";
import { IGatherListItem } from "../../../types/models/gatherTypes/gatherTypes";

interface IGather {
  isMember: boolean;
  kakaoUrl: string;
  content: string;
  gatherList: IGatherListItem[];
}

function GatherContent({ isMember, kakaoUrl, content, gatherList }: IGather) {
  return (
    <Layout>
      <Content>{content}</Content>
      <Box px={5} py={4}>
        <Box mb={2} color="gray.600">
          톡방 링크(승인 후 공개)
        </Box>
        {kakaoUrl && <BlurredLink url={kakaoUrl} isBlur={!isMember} />}
      </Box>
      <ListContainer>
        {gatherList?.map((item, idx) => (
          <ListBlock key={idx}>
            <span>{idx + 1}차</span>
            <span>{item.text}</span>
            <span>
              {item.time.hours}:{item.time.minutes || item.time.minutes + "0"}
            </span>
          </ListBlock>
        ))}
      </ListContainer>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 140px;
  border-bottom: 6px solid var(--gray-200);
`;
const Content = styled.pre`
  min-height: 100px;
  background-color: white;
  padding: var(--gap-4);
  white-space: pre-wrap;
  padding-bottom: var(--gap-4);
  font-family: apple;
`;

const ListContainer = styled.div`
  padding: var(--gap-3) 16px;

  background-color: var(--gray-100);
  border: var(--border);
`;

const ListBlock = styled.div`
  > span:first-child {
    margin-right: var(--gap-3);
    font-weight: 700;
  }
  > span:last-child {
    margin-left: var(--gap-2);
  }
`;

export default GatherContent;
