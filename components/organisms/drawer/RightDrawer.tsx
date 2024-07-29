import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import Header from "../../layouts/Header";

interface RightUserDrawerProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  headerBtn?: React.ReactNode;
}

function RightDrawer({ title, onClose, children, headerBtn }: RightUserDrawerProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer isOpen onClose={handleClose} size="full" placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody p="0">
          <Header
            title={title}
            isSlide={false}
            func={onClose}
            rightPadding={headerBtn ? 4 : undefined}
          >
            {headerBtn}
          </Header>
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default RightDrawer;
