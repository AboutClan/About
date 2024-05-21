import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import styled from "styled-components";

import TwoButtonNav from "../../../components/layouts/TwoButtonNav";
import { DispatchBoolean, DispatchString } from "../../../types/hooks/reactTypes";

interface IQuestionBottomDrawer {
  isModal: boolean;
  setIsModal: DispatchBoolean;
  setQuestion: DispatchString;
  question: string;
}

function QuestionBottomDrawer({
  isModal,
  setIsModal,
  setQuestion,
  question,
}: IQuestionBottomDrawer) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isModal) {
      onOpen();
    }
    if (!isModal) {
      onClose();
    }
  }, [isModal, onClose, onOpen]);

  useEffect(() => {
    // if (!isOpen) setIsModal(false);
  }, [isOpen, setIsModal]);

  const onClickLeft = () => {
    setQuestion(null);
    onClose();
  };

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent borderTopRadius="var(--rounded-lg)">
        <DrawerBody display="flex" flexDir="column" p="var(--gap-4) var(--gap-4)">
          <Title>가입 질문</Title>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="ex) 어떤 목적으로 가입을 희망하시나요?"
          />
          <TwoButtonNav
            leftText="생략"
            rightText="저장"
            onClickLeft={onClickLeft}
            onClickRight={() => setIsModal(false)}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

const Title = styled.div`
  margin: var(--gap-4) 0;
  font-weight: 700;
  font-size: 18px;
`;

const Input = styled.input`
  padding: var(--gap-2);
  border: var(--border);
  height: 50px;
  border-radius: var(--rounded);
  margin-bottom: var(--gap-4);
  :focus {
    outline-color: var(--gray-800);
  }
`;

export default QuestionBottomDrawer;
