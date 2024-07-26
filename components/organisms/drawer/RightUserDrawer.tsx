import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex } from "@chakra-ui/react";

import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import Header from "../../layouts/Header";
import ProfileCommentCard from "../../molecules/cards/ProfileCommentCard";

interface RightUserDrawerProps {
  title: string;
  users: IUserSummary[];
  isOpen: boolean;
  onClose: () => void;
}

function RightUserDrawer({ title, users, isOpen, onClose }: RightUserDrawerProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="full" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p="0">
          <Header title={title} isSlide={false} func={onClose} />
          <Box>
            <Flex direction="column">
              {users.map((who, idx) => (
                <Box key={idx}>
                  <ProfileCommentCard user={who} comment={who.comment} />
                </Box>
              ))}
            </Flex>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default RightUserDrawer;
