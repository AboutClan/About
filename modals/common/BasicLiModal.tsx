import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import styled from "styled-components";

import { useCompleteToast, useErrorToast } from "../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IUserRequest } from "../../types/models/userTypes/userRequestTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function ManagerPopUp({ setIsModal }: IModal) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const footerOptions: IFooterOptions = {
    main: {
      text: "지원하기",
      func: onOpen,
    },
    sub: {},
  };

  return (
    <>
      <ModalLayout title="운영진 모집 공고" footerOptions={footerOptions} setIsModal={setIsModal}>
        <Subtitile>모집 조건</Subtitile>
        <Ol>
          <li>22 ~ 24세</li>
          <li>일주일 2회 스터디 참여 가능하신 분</li>
          <li>사람 만나는 거 좋아하고 외향적이신 분</li>
          <li>오프라인 모임도 종종 참여할 수 있는 분</li>
        </Ol>
        <Subtitile>혜택</Subtitile>
        <Ul>
          <li>매달 커피 값으로 2만원씩 지원</li>
          <li>원하는 스터디 장소 있으면 장소 개설해드려요</li>
          <li>기타 특전</li>
        </Ul>
      </ModalLayout>
      <Dialog isOpen={isOpen} onClose={onClose} setIsModal={setIsModal} />
    </>
  );
}

interface IDialog extends IModal {
  isOpen: boolean;
  onClose: () => void;
}

function Dialog({ isOpen, onClose, setIsModal }: IDialog) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const { mutate } = useUserRequestMutation({
    onSuccess() {
      completeToast("free", "지원이 완료되었습니다.");
      setIsModal(false);
    },
    onError: errorToast,
  });
  const handleSubmit = () => {
    const data: IUserRequest = {
      category: "건의",
      writer: session?.user.name,
      title: "운영진 지원",
      content: session?.user?.uid as string,
    };
    mutate(data);
  };

  const completeRef = useRef();
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={completeRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent m="auto var(--gap-4)">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            운영진에 지원하시겠어요?
          </AlertDialogHeader>
          <AlertDialogBody>신청해주시면 따로 연락드릴게요!</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={completeRef} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="mintTheme" onClick={handleSubmit} ml="var(--gap-1)">
              신청
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

const Subtitile = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: var(--gap-1);
`;

const Ol = styled.ol`
  font-size: 12px;
  margin-left: var(--gap-4);
  margin-bottom: var(--gap-2);
`;

const Ul = styled.ul`
  font-size: 12px;

  margin-left: var(--gap-4);
`;

export default ManagerPopUp;
