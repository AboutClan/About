/* eslint-disable */

import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import { GATHER_COVER_IMAGE } from "../../assets/images/imageUrl";
import KakaoShareBtn from "../../components/Icons/KakaoShareBtn";
import { WEB_URL } from "../../constants/system";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";

import { IFooterOptions, ModalLayout } from "../Modals";

interface IGatherKakaoShareModal extends IModal {
  title: string;
  date: string;
  locationMain: string;
}

function GatherKakaoShareModal({ title, date, locationMain, setIsModal }: IGatherKakaoShareModal) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<number>();
  const [adminImageUrl, setAdminImageUrl] = useState<string>();

  const onClickItem = (idx) => {
    if (idx === selectedItem) setSelectedItem(null);
    else setSelectedItem(idx);
  };

  const footerOptions: IFooterOptions = {
    children: (
      <KakaoShareBtn
        isFull
        title={title}
        subtitle={date === "미정" ? date : dayjs(date).format("M월 D일(dd)")}
        url={WEB_URL + router.asPath}
        isBig={true}
        img={
          adminImageUrl ||
          (selectedItem !== null ? GATHER_COVER_IMAGE[selectedItem] : GATHER_COVER_IMAGE[1])
        }
      />
    ),
  };

  return (
    <ModalLayout footerOptions={footerOptions} title="공유 이미지 선택" setIsModal={setIsModal}>
      <ModalSubtitle>단톡방에 공유 할 이미지를 선택해 주세요!</ModalSubtitle>
      <Container>
        {GATHER_COVER_IMAGE.map((item, idx) => (
          <Item key={idx} onClick={() => onClickItem(idx)} isSelected={idx === selectedItem}>
            <Image src={item} fill={true} sizes="150px" alt="gatherShareImage" />
          </Item>
        ))}
      </Container>
    </ModalLayout>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  gap: var(--gap-3);
`;

const Item = styled.div<{ isSelected: boolean }>`
  position: relative;
  border: ${(props) => (props.isSelected ? "4px solid var(--color-mint)" : null)};
  border-radius: var(--rounded-lg);
  overflow: hidden;
  width: 100%;
  aspect-ratio: 2/1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default GatherKakaoShareModal;
