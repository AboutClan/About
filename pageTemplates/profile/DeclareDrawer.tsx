import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { DECLARE_LIST } from "../../constants/contentsText/requestContents";
import { useCompleteToast, useErrorToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { DispatchString, DispatchType } from "../../types/hooks/reactTypes";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { DeclareRequest, IUserRequest } from "../../types/models/userTypes/userRequestTypes";

interface IDeclareDrawer {
  userData: IUser;
  declareModal: DeclareRequest;
  setDeclareModal: DispatchType<DeclareRequest>;
}

interface IDeclareContent {
  name: string;
  declareIdx: string;
  setDeclareIdx: DispatchString;
}

function DeclareDrawer({ userData, declareModal, setDeclareModal }: IDeclareDrawer) {
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [declareIdx, setDeclareIdx] = useState("0");

  useEffect(() => {
    if ((["declare", "distance"] as DeclareRequest[]).includes(declareModal)) {
      onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [declareModal]);

  useEffect(() => {
    if (!isOpen) setDeclareModal(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const title = declareModal === "declare" ? "신고하기" : "거리두기";

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: sendDeclaration } = useUserRequestMutation({
    onSuccess() {
      completeToast("success");
      onClose();
      setDeclareModal(null);
    },
    onError: errorToast,
  });

  const onSubmit = () => {
    const data: IUserRequest = {
      category: "신고",
      writer: `${userInfo?.name}-${userInfo?.uid}`,
      location: userInfo?.location,
      title: `${userData?.name}-${userData?.uid}`,
      content: declareModal === "declare" ? DECLARE_LIST[declareIdx] : "거리두기",
    };

    sendDeclaration(data);
  };

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent h="400px">
        <DrawerHeader
          borderBottomWidth="1px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <div />
          <Title>{title}</Title>

          <button onClick={onClose}>
            <i className="fa-solid fa-x fa-sm" />
          </button>
        </DrawerHeader>
        <DrawerBody p="var(--gap-4) " display="flex" flexDirection="column">
          {declareModal === "declare" ? (
            <DeclareContent
              name={userData?.name}
              declareIdx={declareIdx}
              setDeclareIdx={setDeclareIdx}
            />
          ) : (
            <DistanceContent name={userData?.name} />
          )}
          <Button
            onClick={onSubmit}
            color="white"
            bg="var(--color-red)"
            h="40px"
            mt="auto"
            _focus={{ outline: "none" }}
          >
            {title}
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function DistanceContent({ name }: { name: string }) {
  return (
    <>
      <DistanceHeader>&apos;{`${name}`}&apos;님과 거리두기를 요청하시겠어요?</DistanceHeader>
      <DistanceText>
        <div>
          <li>스터디에 투표하거나 참여한 내용을 상대는 볼 수 없어요.</li>
          <li>모임에 투표하거나 참여한 내용을 상대는 볼 수 없어요.</li>
          <li>스터디가 겹치는 경우에 취소해도 벌금이 부과되지 않아요.</li>
          <li>조모임 편성시 다른조로 배치돼요.</li>
        </div>
        <div>
          <li>해당 내용은 비공개로 운영진을 제외하고는 알 수 없습니다.</li>
          <li>
            여러 인원에게 거리두기가 되고 있는 인원은 원인을 확인하고 조치가 이루어 질 수 있습니다.
          </li>
          <li>신고 사유에 해당하는 경우에는 신고 기능을 이용해주세요.</li>
          <li>거리두기 해제는 마이페이지에서 가능합니다.</li>
        </div>
      </DistanceText>
    </>
  );
}

function DeclareContent({ name, declareIdx, setDeclareIdx }: IDeclareContent) {
  return (
    <>
      <DistanceHeader>&apos;{`${name}`}&apos;님을 신고하시겠어요?</DistanceHeader>
      <DeclareOverview>
        다른 인원에게 피해를 주는 행위를 엄격히 금지하고 있습니다. 불편한 상황이 있는 경우 주저하지
        말고 신고해주세요!
      </DeclareOverview>
      <RadioGroup onChange={setDeclareIdx} value={declareIdx}>
        <DeclareText>
          {DECLARE_LIST.map((content, idx) => (
            <Radio
              key={idx}
              _focus={{ outline: "none" }}
              size="lg"
              value={String(idx)}
              colorScheme="redTheme"
            >
              {content}
            </Radio>
          ))}
        </DeclareText>
      </RadioGroup>
    </>
  );
}

const Title = styled.span``;

const DistanceHeader = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: var(--gap-4);
`;

const DistanceText = styled.div`
  > div {
    font-size: 12px;
    color: var(--gray-200);
    margin-bottom: var(--gap-3);
  }
`;

const DeclareOverview = styled.p`
  font-size: 13px;
  margin-bottom: var(--gap-5);
  color: var(--gray-200);
`;

const DeclareText = styled.div`
  display: flex;
  flex-direction: column;
  > label {
    margin-bottom: var(--gap-2);
    > span {
      color: var(--gray-800);
      font-size: 13px !important;
    }
  }
`;

export default DeclareDrawer;
