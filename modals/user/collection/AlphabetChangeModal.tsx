import { Box } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import { AlphabetIcon } from "../../../components/Icons/AlphabetIcon";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useInteractionMutation } from "../../../hooks/user/sub/interaction/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { Alphabet } from "../../../types/models/collections";
import { IFooterOptions, ModalLayout } from "../../Modals";

interface IAlphabetChangeModal extends IModal {
  myAlphabets: Alphabet[];
  opponentAlpabets: Alphabet[];
  toUid: string;
}

function AlphabetChangeModal({
  setIsModal,
  myAlphabets,
  toUid,
  opponentAlpabets,
}: IAlphabetChangeModal) {
  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: requestAlphabet } = useInteractionMutation("alphabet", "post", {
    onSuccess() {
      toast("success", "요청을 전송했습니다.");
      setIsModal(false);
    },
  });

  const [selectedAlphabet, setSelectedAlphabet] = useState<{
    mine: Alphabet;
    opponent: Alphabet;
  }>({ mine: null, opponent: null });

  const onClickAlphabet = (type: "mine" | "opponent", alphabet: Alphabet) => {
    const alphabets = type === "opponent" ? opponentAlpabets : myAlphabets;
    const failMessage =
      type === "opponent"
        ? "상대가 해당 알파벳을 보유하고 있지 않습니다."
        : "해당 알파벳을 보유하고 있지 않습니다.";

    if (!alphabets.includes(alphabet)) {
      toast("warning", failMessage);
      return;
    }

    setSelectedAlphabet((old) => ({
      ...old,
      [type]: old[type] === alphabet ? null : alphabet,
    }));
  };

  const handleAlphabetChange = () => {
    if (!selectedAlphabet.mine || !selectedAlphabet.opponent) {
      toast("warning", "교환 할 알파벳을 선택해주세요.");
      return;
    }
    requestAlphabet({
      message: `${userInfo.name}님의 알파벳 교환 요청`,
      toUid: toUid,
      sub: `${selectedAlphabet.mine}/${selectedAlphabet.opponent}`,
    });
  };
  const ABOUT: Alphabet[] = ["A", "B", "O", "U", "T"];

  const footerOptions: IFooterOptions = {
    main: {
      text: "교환 신청",
      func: handleAlphabetChange,
    },
  };

  return (
    <ModalLayout title="알파벳 교환 신청" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box fontSize="12px" mr="auto" color="gray.600">
        내가 보유중인 알파벳
      </Box>
      <AlphabetContainer>
        {ABOUT.map((alphabet) => (
          <AlphabetBtn
            isSelected={alphabet === selectedAlphabet?.mine}
            key={alphabet}
            onClick={() => onClickAlphabet("mine", alphabet)}
          >
            <AlphabetIcon alphabet={alphabet} isDuotone={!myAlphabets?.includes(alphabet)} />
          </AlphabetBtn>
        ))}
      </AlphabetContainer>
      <Box fontSize="12px" mr="auto" color="gray.600" mt={5}>
        상대가 보유중인 알파벳
      </Box>
      <AlphabetContainer>
        {ABOUT.map((alphabet) => (
          <AlphabetBtn
            isSelected={alphabet === selectedAlphabet?.opponent}
            key={alphabet}
            onClick={() => onClickAlphabet("opponent", alphabet)}
          >
            <AlphabetIcon alphabet={alphabet} isDuotone={!opponentAlpabets?.includes(alphabet)} />
          </AlphabetBtn>
        ))}
      </AlphabetContainer>
    </ModalLayout>
  );
}

const AlphabetContainer = styled.div`
  margin-top: var(--gap-2);
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  align-items: center;
`;

const AlphabetBtn = styled.button<{ isSelected: boolean }>`
  padding: 12px;
  height: 46px;
  width: 46px;
  border-radius: var(--rounded-lg);
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${(props) => (props.isSelected ? "var(--border-mint)" : "var(--border-main)")};
`;

export default AlphabetChangeModal;
