import { Box } from "@chakra-ui/react";

import { ModalLayout } from "@/components/modals/Modals";
import { IModal } from "@/types/components/modalTypes";

export interface IContentBasic {
  title: string;
  text?: string;
  texts?: string[];
}
export interface IRuleModalContent {
  headerContent: IContentBasic;
  mainContent: IContentBasic[];
}

interface IRuleModal extends IModal {
  title: string;
  text: string;
  children: React.ReactNode;
}

function RuleModal({ setIsModal, title, text, children }: IRuleModal) {
  return (
    <ModalLayout title={title} footerOptions={{}} setIsModal={setIsModal}>
      <Box mb={3}>{text}</Box>
      {children}
    </ModalLayout>
  );
}

export default RuleModal;
