import { useToast } from "@chakra-ui/react";
import { SetStateAction, useState } from "react";
import styled from "styled-components";
import { ModalHeaderXLine } from "../../components/layouts/Modals";
import ModalPortal from "../../components/ModalPortal";
import {
  ModalFooterNav,
  ModalMain,
  ModalMd,
  ModalSubtitle,
} from "../../styles/layout/modal";
import RequestSuggestModal from "../userRequest/RequestSuggestModal";

interface ISuggestPopUp {
  setIsModal: React.Dispatch<SetStateAction<boolean>>;
}

function SuggestPopUp({ setIsModal }: ISuggestPopUp) {
  const toast = useToast();
  const [isSuggest, setIsSuggest] = useState(false);
  const onClickClosed = () => {
    toast({
      title: "기다릴게요",
      description: "건의사항은 마이페이지에서 언제든 작성할 수 있어요!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setIsModal(false);
  };
  return (
    <>
      <Layout>
        <ModalHeaderXLine title="아이디어 제공" setIsModal={setIsModal} />
        <ModalMain>
          <ModalSubtitle>
            어떻게 하면 더 열심히 참여할까요? (+ 5점)
          </ModalSubtitle>
          <div>
            컨텐츠든, 운영방식이든 어떤 의견이든 좋습니다🥰 아이디어가
            고갈됐어요 🥲 스터디가 더 활성화되기 위한 모두의 의견이 필요해요...!
            어떻게 하면 더 열심히 나올 거 같아요?
          </div>
        </ModalMain>
        <ModalFooterNav>
          <button onClick={onClickClosed}>닫기</button>
          <button onClick={() => setIsSuggest(true)}>건의하기</button>
        </ModalFooterNav>
      </Layout>
      {isSuggest && (
        <ModalPortal setIsModal={setIsSuggest}>
          <RequestSuggestModal setIsModal={setIsSuggest} />
        </ModalPortal>
      )}
    </>
  );
}

const Layout = styled(ModalMd)``;

export default SuggestPopUp;
