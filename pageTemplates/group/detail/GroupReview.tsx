import { Box, Flex } from "@chakra-ui/react";
import FeedLayout from "../../../components/organisms/FeedLayout";
import { convertFeedToLayout } from "../../../libs/convertFeedToLayout";
import { FeedProps } from "../../../types/models/feed";

interface GroupReviewProps {
  feeds: FeedProps[];
}

function GroupReview({ feeds }: GroupReviewProps) {
  return (
    <Box mx={5}>
      <Flex mb={2} fontSize="18px" lineHeight="28px">
        <Box mr={2} fontWeight="bold">
          활동 리뷰 {feeds?.length}
        </Box>
      </Flex>
      <Box>
        {feeds?.length ? (
          feeds?.map((feed) => (
            <FeedLayout key={feed.id} {...convertFeedToLayout(feed)} isSmall isRadius />
          ))
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}

export default GroupReview;
