import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import Header from "../../../components/layouts/Header";
import FeedLayout from "../../../components/organisms/FeedLayout";
import { convertFeedToLayout } from "../../../libs/convertFeedToLayout";
import { FeedProps } from "../../../types/models/feed";

interface GatherReviewDrawerProps {
  feed: FeedProps;
  isOpen: boolean;
  onClose: () => void;
}

function GatherReviewDrawer({ feed, isOpen, onClose }: GatherReviewDrawerProps) {
  console.log(feed);
  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="full" placement="bottom">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p="0">
          <Header title="모임 리뷰" isSlide={false} func={onClose} />
          <Box>
            <FeedLayout {...convertFeedToLayout(feed)} />
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default GatherReviewDrawer;
