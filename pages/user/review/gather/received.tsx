import { Box, Flex } from "@chakra-ui/react";

import { MainLoadingAbsolute } from "../../../../components/atoms/loaders/MainLoading";
import Header from "../../../../components/layouts/Header";
import Slide from "../../../../components/layouts/PageSlide";
import FeedLayout, { FeedLayoutProps } from "../../../../components/organisms/FeedLayout";
import { useFeedTypeQuery } from "../../../../hooks/feed/queries";
import { convertFeedToLayout } from "../../../../libs/convertFeedToLayout";

function Review() {
  const { data } = useFeedTypeQuery("recieve", "gather");
  console.log(24, data);
  return (
    <>
      <Header title="내 후기" />
      <Slide isNoPadding>
        <Box mt="56px">
          {data ? (
            data?.length ? (
              data.map((feed, idx) => {
                const feedProps: FeedLayoutProps = convertFeedToLayout(feed);
                return (
                  <Box key={idx} id={`review${feed.typeId}`}>
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
            <Box mt="180px" position="relative">
              <MainLoadingAbsolute size="md" />
            </Box>
          )}
        </Box>
      </Slide>
    </>
  );
}

export default Review;
