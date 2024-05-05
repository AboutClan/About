import { useRouter } from "next/router";
import styled from "styled-components";

import { AlphabetIcon } from "../../components/atoms/Icons/AlphabetIcon";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { Alphabet } from "../../types/models/collections";
import { IFooterOptions, ModalLayout } from "../Modals";

function AlphabetPopUp({ setIsModal }: IModal) {
  const router = useRouter();
  const alphabets: Alphabet[] = ["A", "B", "O", "U", "T"];

  const footerOptions: IFooterOptions = {
    main: {
      text: "보러가기",
      func: () => router.push("/user/alphabet"),
    },
    sub: {},
    isFull: true,
  };

  return (
    <ModalLayout title="알파벳 컬렉션" footerOptions={footerOptions} setIsModal={setIsModal}>
      <ModalSubtitle>
        스터디 출석 또는 친구와의 교환을 통해 알파벳을 수집해봐요! 다양한 상품을 드립니다!
      </ModalSubtitle>
      <AlphabetContainer>
        {alphabets.map((item) => (
          <AlphabetIcon key={item} alphabet={item} size="md" isBg={true} />
        ))}
      </AlphabetContainer>
    </ModalLayout>
  );
}

const AlphabetContainer = styled.div`
  display: flex;
  margin-top: var(--gap-1);
  margin-bottom: var(--gap-5);
  font-size: 14px;
  align-items: center;

  flex: 1;
  justify-content: space-around;
  > * {
    margin-right: var(--gap-1);
  }
`;

export default AlphabetPopUp;
