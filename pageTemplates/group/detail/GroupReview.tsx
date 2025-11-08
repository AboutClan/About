import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import FeedLayout from "../../../components/organisms/FeedLayout";
import { convertFeedToLayout } from "../../../libs/convertFeedToLayout";
import { FeedProps } from "../../../types/models/feed";

interface GroupReviewProps {
  feeds: FeedProps[];
}

function GroupReview({ feeds }: GroupReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box mx={5}>
      <Flex mb={2} fontSize="18px" lineHeight="28px">
        <Box mr={2} fontWeight="bold">
          활동 리뷰 {feeds?.length}
        </Box>
      </Flex>
      <Box>
        {feeds?.length ? (
          (isOpen ? feeds : feeds.slice(0, 3))?.map((feed) => (
            <Box mb={2} key={feed.id}>
              <FeedLayout {...convertFeedToLayout(feed)} isSmall isRadius />
            </Box>
          ))
        ) : (
          <>
            <Box color="gray.600" mb={40} as="p" fontSize="14px" mt={20} textAlign="center">
              아직 업로드 된 리뷰가 없습니다.
            </Box>
          </>
        )}
      </Box>{" "}
      {!isOpen && feeds?.length >= 3 && (
        <Button
          mt={2}
          w="100%"
          h="40px"
          bgColor="white"
          border="0.5px solid #E8E8E8"
          onClick={() => setIsOpen(true)}
        >
          더보기
        </Button>
      )}
    </Box>
  );
}

export default GroupReview;
