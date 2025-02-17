import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useErrorToast, useFailToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import {
  useUserInfoFieldMutation,
  useUserUpdateProfileImageMutation,
} from "../../../hooks/user/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { ModalLayout } from "../../Modals";
import RequestChagneProfileImageModalBadge from "./RequestChagneProfileImageModalBadge";
import RequestChangeProfileImageModalAvatar from "./RequestChangeProfileImageModalAvatar";
import SpecialAvatarModal from "./SpecialAvatarModal";

function RequestChangeProfileImageModal({ setIsModal }: IModal) {
  const { data: session } = useSession();
  const failToast = useFailToast();
  const errorToast = useErrorToast();
  const typeToast = useTypeToast();

  const isGuest = session?.user.name === "guest";

  const queryClient = useQueryClient();

  const [pageNum, setPageNum] = useState(0);

  const { mutate: updateProfile } = useUserUpdateProfileImageMutation();

  const { mutate: setUserAvatar } = useUserInfoFieldMutation("avatar", {
    onSuccess() {
      typeToast("change");
      queryClient.invalidateQueries([USER_INFO]);
      setIsModal(false);
    },
    onError: errorToast,
  });

  const onClickKakao = () => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    updateProfile();
    setUserAvatar({ type: null, bg: null });
  };

  return (
    <>
      {pageNum === 0 ? (
        <ModalLayout title="프로필 변경" setIsModal={setIsModal}>
          <Container>
            <Button colorScheme="mint" size="lg" onClick={() => setPageNum(1)}>
              아바타 선택
            </Button>
            <Button mt="12px" size="lg" onClick={() => setPageNum(2)}>
              스페셜 아바타 / 배경 선택
            </Button>
            <Button mt="12px" size="lg" onClick={onClickKakao}>
              카카오 프로필로 변경 / 업데이트
            </Button>
            <Button mt="12px" size="lg" onClick={() => setPageNum(3)}>
              이벤트 배지로 변경
            </Button>
          </Container>
        </ModalLayout>
      ) : pageNum === 1 ? (
        <RequestChangeProfileImageModalAvatar setIsModal={setIsModal} />
      ) : pageNum === 2 ? (
        <SpecialAvatarModal setIsModal={setIsModal} />
      ) : (
        <RequestChagneProfileImageModalBadge setIsModal={setIsModal} />
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export default RequestChangeProfileImageModal;
