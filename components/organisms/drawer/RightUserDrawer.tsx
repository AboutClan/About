import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import Header from "../../layouts/Header";

interface RightUserDrawerProps {
  title: string;

  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function RightUserDrawer({ title, isOpen, onClose, children }: RightUserDrawerProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} size="full" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p="0">
          <Header title={title} isSlide={false} func={onClose} />
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default RightUserDrawer;
