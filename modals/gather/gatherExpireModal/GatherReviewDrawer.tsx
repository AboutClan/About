import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";
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
  const handleClose = () => {
    onClose();
  };

  const [data, setData] = useState<FeedProps>();

  useEffect(() => {
    if (!feed) return;

    const timeout = setTimeout(() => {
      setData(feed);
    }, 200);
    return () => clearTimeout(timeout);
  }, [feed]);

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="full" placement="bottom">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p="0">
          <Header title="모임 리뷰" isSlide={false} func={onClose} />
          <Box>
            {data ? <FeedLayout {...convertFeedToLayout(data)} /> : <MainLoadingAbsolute />}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default GatherReviewDrawer;
