import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { MainLoadingAbsolute } from "../../../../components/atoms/loaders/MainLoading";
import FeedLayout, { FeedLayoutProps } from "../../../../components/organisms/FeedLayout";
import { useFeedsQuery } from "../../../../hooks/feed/queries";
import { FeedProps } from "../../../../types/models/feed";
import { IGroup } from "../../../../types/models/groupTypes/group";
import { getDateDiff } from "../../../../utils/dateTimeUtils";

interface ContentFeedProps {
  group: IGroup;
}

function ContentFeed({ group }: ContentFeedProps) {
  const { data: feeds } = useFeedsQuery("group", group.id);

  const feedArr = feeds as FeedProps[];

  return (
    <Box position="relative" minH="240px">
      {feedArr ? (
        feedArr?.length ? (
          feedArr.map((feed, idx) => {
            const feedProps: FeedLayoutProps = {
              user: feed.writer,
              type: feed.type,
              date: getDateDiff(dayjs(feed.createdAt)),
              images: feed.images,
              content: feed.text,
              likeUsers: feed.like,
              likeCnt: feed?.likeCnt,
              id: feed.typeId,
              comments: feed.comments,
              isAnonymous: feed.isAnonymous as boolean,
            };
            return (
              <Box key={idx}>
                <FeedLayout {...feedProps} />
              </Box>
            );
          })
        ) : (
          <Flex fontSize="18px" height="200px" justify="center" align="center">
            게시된 피드가 없습니다.
          </Flex>
        )
      ) : (
        <MainLoadingAbsolute size="sm" />
      )}
    </Box>
  );
}

export default ContentFeed;
