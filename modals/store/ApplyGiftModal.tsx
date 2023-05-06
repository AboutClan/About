import { Button, useToast } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { ModalHeaderXLine } from "../../components/ui/Modal";
import CountNum from "../../components/utils/CountNum";
import { useStoreMutation } from "../../hooks/store/mutation";
import { useStoreQuery } from "../../hooks/store/queries";
import { usePointMutation } from "../../hooks/user/pointSystem/mutation";
import { usePointQuery } from "../../hooks/user/pointSystem/queries";

import {
  ModalHeaderLine,
  ModalLg,
  ModalMain,
  ModalMd,
  ModalSubtitle,
  ModalXs,
} from "../../styles/layout/modal";
import { IStoreGift } from "../../types/store";

function ApplyGiftModal({
  setIsModal,
  giftInfo,
}: {
  setIsModal: React.Dispatch<SetStateAction<boolean>>;
  giftInfo: IStoreGift;
}) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const toast = useToast();
  const { data: myPoint } = usePointQuery();
  const [value, setValue] = useState(1);
  console.log(session);
  const { mutate } = useStoreMutation();
  const { mutate: getPoint } = usePointMutation();

  const totalCost = giftInfo.point * value;

  const date = giftInfo?.date;

  const isOpen = dayjs() >= date?.startDay && dayjs() <= date?.endDay;

  const onApply = () => {
    if (isGuest) {
      toast({
        title: "실패",
        description: "게스트는 사용할 수 없는 기능입니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    if (myPoint.point < totalCost) {
      toast({
        title: "실패",
        description: "보유하고 있는 포인트가 부족해요",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const info = {
      name: session.user.name,
      uid: session.uid,
      cnt: value,
      giftid: giftInfo?.giftid,
    };
    mutate(info);
    getPoint({ value: -totalCost, text: `${giftInfo?.name}응모` });
    toast({
      title: "성공",
      description: "응모에 성공했어요. 당첨 발표일을 기다려주세요 !",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setIsModal(false);
  };

  return (
    <Layout>
      <ModalHeaderXLine title="응모" setIsModal={setIsModal} />
      <ModalMain>
        <Title>
          <b>상품</b>
          <span>{giftInfo?.name}</span>
        </Title>
        <Price>
          <span>
            <b>보유 포인트</b>&nbsp;
            <span>{myPoint?.point} point</span>
          </span>
          <span>
            <b>필요 포인트</b>&nbsp;
            <PricePoint overMax={totalCost > myPoint?.point}>
              {totalCost} point
            </PricePoint>
          </span>
        </Price>
        <CountNav>
          <CountNum value={value} setValue={setValue} />
        </CountNav>
      </ModalMain>
      <Footer>
        <Button
          // disabled={!isOpen}
          width="100%"
          colorScheme="blackAlpha"
          onClick={onApply}
        >
          {isOpen ? "응모하기" : "응모 기간이 아닙니다."}
        </Button>
      </Footer>
    </Layout>
  );
}

const Layout = styled(ModalXs)``;

const Title = styled.div`
  font-size: 13px;
  margin-bottom: 2px;
  > b {
    color: var(--font-h1);
    margin-right: 4px;
  }
  > span {
    font-size: 14px;
  }
`;

const Price = styled.div`
  display: flex;
  flex-direction: column;
  > span {
    display: inline-block;
    margin-bottom: 2px;

    > span {
      font-size: 14px;
    }
    > b {
      color: var(--font-h1);
      margin-right: 4px;
    }
  }
`;
const PricePoint = styled.span<{ overMax: boolean }>`
  color: ${(props) => props.overMax && "var(--color-red)"};
`;

const CountNav = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: 6px;
`;

const Footer = styled.footer``;

export default ApplyGiftModal;
