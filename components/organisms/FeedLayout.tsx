import { AspectRatio, Box, Flex } from "@chakra-ui/react";

import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import ContentSummary from "../atoms/ContentSummary";
import ContentHeartBar from "../molecules/ContentHeartBar";
import FeedHeader from "../molecules/headers/FeedHeader";
import SummaryBlock, { SummaryBlockProps } from "../molecules/SummaryBlock";
import ImageSlider from "./imageSlider/ImageSlider";

interface FeedLayoutProps {
  user: IUserSummary;
  date: string;
  images: string[];
  content: string;
  summary?: SummaryBlockProps;
  likeUsers: IUserSummary[];
}

function FeedLayout({ user, date, images, content, summary, likeUsers }: FeedLayoutProps) {
  return (
    <Flex direction="column" border="var(--border)">
      <FeedHeader writer={user} date={date} />
      <AspectRatio ratio={1}>
        <ImageSlider imageContainer={images} type="review" />
      </AspectRatio>
      {summary ? (
        <Box p="16px">
          <SummaryBlock url={summary.url} title={summary.title} text={summary.text} />
        </Box>
      ) : (
        <Box h="20px" />
      )}
      {content && <ContentSummary text={content} />}
      <ContentHeartBar likeUsers={likeUsers} />
    </Flex>
  );
}

export default FeedLayout;
