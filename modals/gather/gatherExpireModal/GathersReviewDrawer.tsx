import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MainLoadingAbsolute } from "../../../components/atoms/loaders/MainLoading";

import Header from "../../../components/layouts/Header";
import FeedLayout from "../../../components/organisms/FeedLayout";
import { convertFeedToLayout } from "../../../libs/convertFeedToLayout";
import { FeedProps } from "../../../types/models/feed";

interface GathersReviewDrawerProps {
  feeds: FeedProps[];
  isOpen: boolean;
  onClose: () => void;
}

function GathersReviewDrawer({ feeds, isOpen, onClose }: GathersReviewDrawerProps) {
  const handleClose = () => {
    onClose();
  };

  const [data, setData] = useState<FeedProps[]>([]);

  useEffect(() => {
    if (!feeds?.length) return;

    const timeout = setTimeout(() => {
      setData(feeds);
    }, 200);
    return () => clearTimeout(timeout);
  }, [feeds]);

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="full" placement="bottom">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p="0">
          <Header title="모임 리뷰" isSlide={false} func={onClose} />
          <Box>
            {data?.length ? (
              data.map((feed, idx) => <FeedLayout key={idx} {...convertFeedToLayout(feed)} />)
            ) : (
              <MainLoadingAbsolute />
            )}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default GathersReviewDrawer;
