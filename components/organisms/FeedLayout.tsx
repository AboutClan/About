import { AspectRatio, Box, Flex } from "@chakra-ui/react";

import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { FeedComment } from "../../types/models/feed";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import ContentSummary from "../atoms/ContentSummary";
import ContentHeartBar from "../molecules/ContentHeartBar";
import FeedHeader from "../molecules/headers/FeedHeader";
import SummaryBlock, { SummaryBlockProps } from "../molecules/SummaryBlock";
import ImageSlider from "./imageSlider/ImageSlider";

export interface FeedLayoutProps {
  user: IUserSummary;
  date: string;
  images: string[];
  content: string;
  summary?: SummaryBlockProps;
  refetch?: () => void;
  likeUsers: IUserSummary[];
  likeCnt: number;
  id: string;
  comments: FeedComment[];
  isAnonymous: boolean;
  type: "gather" | "group";
}

function FeedLayout({
  date,
  images,
  content,
  likeUsers,
  likeCnt,
  summary,
  comments,
  isAnonymous,
  id,
  user,
  refetch,
}: FeedLayoutProps) {

  return (
    <Flex direction="column" border="var(--border)" pb={2}>
      <FeedHeader writer={isAnonymous ? ABOUT_USER_SUMMARY : user} date={date} />
      <AspectRatio ratio={1}>
        <ImageSlider imageContainer={images} type="review" />
      </AspectRatio>
      <Box px="16px">
        {summary ? (
          <Box pt="16px" pb="0">
            <SummaryBlock url={summary.url} title={summary.title} text={summary.text} />
          </Box>
        ) : null}
        <Box pt="16px" pb="12px">
          {content && <ContentSummary text={content} />}
        </Box>
      </Box>
      <ContentHeartBar
        comments={comments}
        feedId={id}
        likeUsers={likeUsers}
        likeCnt={likeCnt}
        refetch={refetch}
      />
    </Flex>
  );
}

export default FeedLayout;
