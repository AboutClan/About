import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  PortalManager,
} from "@chakra-ui/react";

import MemberCard from "./MemberCard";

interface MemberCardModalProps {
  onClose: () => void;
}

function MemberCardModal({ onClose }: MemberCardModalProps) {
  return (
    <PortalManager zIndex={5000}>
      <Modal isOpen onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={4} h="563px" bg="transparent" boxShadow="none" maxW="380px">
          <ModalCloseButton color="white" top="-36px" right="0" size="lg" />
          <MemberCard />
        </ModalContent>
      </Modal>
    </PortalManager>
  );
}

export default MemberCardModal;
