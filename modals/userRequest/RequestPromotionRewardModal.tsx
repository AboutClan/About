import { Button } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

import { CopyBtn } from "@/components/Icons/CopyIcon";
import { IFooterOptions, ModalLayout } from "@/components/modals/Modals";
import { PROMOTION_TEXT,PromotionComponent } from "@/constants/contentsText/Private";
import { useErrorToast, useToast } from "@/hooks/custom/CustomToast";
import { useUserRequestMutation } from "@/hooks/user/sub/request/mutations";
import { IModal } from "@/types/components/modalTypes";

function RequestPromotionRewardModal({ setIsModal }: IModal) {
  const toast = useToast();
  const errorToast = useErrorToast();

  const [isFirst, setIsFirst] = useState(true);

  const { mutate: sendPromotionReward } = useUserRequestMutation({
    onSuccess: () => toast("success", "이벤트 응모 및 포인트 지급 완료!"),
    onError: errorToast,
  });

  const onSubmit = () => {
    sendPromotionReward({
      category: "홍보",
    });
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "게시 완료",
      func: onSubmit,
    },
    sub: {
      text: "확인",
    },
  };

  return (
    <ModalLayout setIsModal={setIsModal} footerOptions={footerOptions} title="홍보 리워드 신청">
      <Overview>
        에브리타임 홍보 게시판에 아래 홍보글을 올려주시면 ABOUT 포인트와 추첨을 통해 꽤 높은 확률로
        상품을 보내드립니다! 도와주시는 모든 분들 감사합니다!
      </Overview>
      {isFirst ? (
        <Container>
          <PromotionComponent />
          <CopyWrapper>
            <CopyBtn size="lg" text={PROMOTION_TEXT} />
          </CopyWrapper>
        </Container>
      ) : (
        <ImageContainer>
          <Image
            src="https://user-images.githubusercontent.com/84257439/235453825-026ca653-d356-485a-a916-19c21352e10a.png"
            alt="promotionImage"
            width={165}
            height={166}
          />
          <ImageText>이미지를 꾹 눌러서 저장해주세요!</ImageText>
        </ImageContainer>
      )}
      <Button mt="var(--gap-1)" onClick={() => setIsFirst((old) => !old)}>
        {isFirst ? "이미지 다운로드" : "돌아가기"}
      </Button>
      <Message>
        제목은 &quot;스터디 & 친목 동아리 ABOUT&quot; 로 적어주시면 되고, 이미지는 굳이 안넣어주셔도
        돼요! 여러번 지원해도 너무 환영하니 자주 신청해주세요 🙂
      </Message>
    </ModalLayout>
  );
}

const Overview = styled.div`
  margin-bottom: var(--gap-3);
  font-weight: 600;
`;

const ImageText = styled.span`
  font-size: 12px;
  color: var(--gray-800);
  margin-bottom: auto;
`;
const Container = styled.div``;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CopyWrapper = styled.div`
  margin-top: var(--gap-3);
`;

const Message = styled.div`
  margin-top: var(--gap-4);
  text-align: center;
  font-weight: 600;
`;

export default RequestPromotionRewardModal;
