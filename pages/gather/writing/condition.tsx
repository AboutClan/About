import { Box, Button, Flex, Switch } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { Input } from "../../../components/atoms/Input";
import { PopOverIcon } from "../../../components/Icons/PopOverIcon";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useToast } from "../../../hooks/custom/CustomToast";
import GatherWritingUserConditionModal from "../../../modals/gather/GatherWritingUserConditionModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";
import { randomPassword } from "../../../utils/validationUtils";

export type GatherConditionType =
  | "gender"
  | "age"
  | "pre"
  | "location"
  | "manager"
  | "kakaoUrl"
  | "isApprove";

function WritingCondition() {
  const toast = useToast();
  const router = useRouter();
  const [gatherContent, setGatherContent] = useRecoilState(sharedGatherWritingState);
  const { data: session } = useSession();

  const [condition, setCondition] = useState({
    gender: gatherContent?.genderCondition || false,
    age: gatherContent?.age ? true : false,
    pre: gatherContent?.preCnt ? true : false,
    location: gatherContent?.place ? gatherContent.place === session?.user.location : false,
    manager: true,
    kakaoUrl: true,
    isApprove: gatherContent?.isApprovalRequired || false,
  });

  const [isMemberConditionModal, setIsMemberConditionModal] = useState(false);
  const [password, setPassword] = useState(gatherContent?.password);

  const [kakaoUrl, setKakaoUrl] = useState<string>(gatherContent?.kakaoUrl || "");

  // const isManager = ["manager", "previliged"].includes(session?.user.role);
  console.log(gatherContent?.kakaoUrl);
  const onClickNext = () => {
    if (condition.kakaoUrl && !kakaoUrl) {
      toast("error", "입장 가능한 오픈채팅방 링크를 입력해 주세요.");
      return;
    }

    const gatherData: IGatherWriting = {
      age: [19, 28],
      memberCnt: {
        min: 4,
        max: 8,
      },
      ...gatherContent,
      preCnt: condition.pre ? 1 : 0,
      genderCondition: condition.gender,
      password,
      user: session?.user.id,
      isAdminOpen: !condition.manager,
      kakaoUrl,
      isApprovalRequired: condition.isApprove,
    };
    setGatherContent(gatherData);
    router.push({ pathname: `/gather/writing/image`, query: router.query });
  };

  useEffect(() => {
    if (!password) setPassword(randomPassword());
  }, [password]);

  const toggleSwitch = (e: ChangeEvent<HTMLInputElement>, type: GatherConditionType) => {
    const isChecked = e.target.checked;
    setCondition((old) => {
      return { ...old, [type]: isChecked };
    });
  };

  const getMemberConditionText = () => {
    const temp = [];
    if (condition.age && (condition.age[0] !== 19 || condition.age[1] !== 28)) {
      temp.push("나이");
    }
    if (condition.gender) {
      temp.push("성별");
    }

    if (
      gatherContent?.memberCnt?.max !== undefined &&
      gatherContent?.memberCnt?.max !== 0 &&
      gatherContent?.memberCnt?.max !== 8
    ) {
      temp.push("인원");
    }
    if (temp.length) return String(temp) + " " + "제한";
    return null;
  };

  return (
    <>
      <>
        <Slide isFixed={true}>
          <ProgressStatus value={83} />
          <Header isSlide={false} title="" />
        </Slide>
        <RegisterLayout>
          <RegisterOverview>
            <span>어떤 인원과 함께하고 싶나요?</span>
            <span>조건을 선택해 주세요</span>
          </RegisterOverview>
          <Container>
            <Item>
              <Name>
                <div>
                  <i className="fa-solid fa-user-lock" />
                </div>
                <span>참여 가능 조건</span>
              </Name>
              <Box ml="auto" mr="20px" fontSize="12px" color="var(--color-mint)">
                {getMemberConditionText() || "제한 없음"}
              </Box>
              <Button colorScheme="mint" size="sm" onClick={() => setIsMemberConditionModal(true)}>
                설정
              </Button>
            </Item>

            <Item>
              <Name>
                <div>
                  <i className="fa-solid fa-person-to-door" />
                </div>
                <span>참여 승인제 사용</span>
                <PopOverIcon text="선착순 참여가 아니라 모임장이 승인하는 방식으로 진행됩니다." />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mint"
                isChecked={condition.isApprove}
                onChange={(e) => toggleSwitch(e, "isApprove")}
              />
            </Item>

            <Item>
              <Name>
                <div>
                  <i className="fa-solid fa-comments" />
                </div>
                <span>오픈채팅방</span>{" "}
                <PopOverIcon text="참여 멤버들은 해당 톡방으로 입장합니다. 운영진에게 개설을 요청해도 됩니다." />
              </Name>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mint"
                isChecked={condition.kakaoUrl}
                onChange={(e) => toggleSwitch(e, "kakaoUrl")}
              />
            </Item>
            {condition.kakaoUrl && (
              <Flex align="center" mr="4px">
                <Box
                  fontSize="12px"
                  bgColor="var(--gray-500)"
                  color="white"
                  p="2px 6px"
                  borderRadius="4px"
                  mr="8px"
                >
                  URL
                </Box>
                <Input
                  size="sm"
                  isLine
                  value={kakaoUrl}
                  onChange={(e) => setKakaoUrl(e.target.value)}
                />
              </Flex>
            )}
          </Container>
        </RegisterLayout>
        <BottomNav onClick={() => onClickNext()} />
      </>

      {isMemberConditionModal && (
        <GatherWritingUserConditionModal
          type="gather"
          setIsModal={setIsMemberConditionModal}
          gatherContent={gatherContent}
          isGenderCondition={condition.gender}
          isAgeCondition={condition.age}
          toggleSwitch={toggleSwitch}
        />
      )}
    </>
  );
}

const Name = styled.div`
  display: flex;
  align-items: center;
  > div:first-child {
    text-align: center;
    width: 20px;
  }
  span {
    margin-left: var(--gap-2);
  }
`;

const Container = styled.div`
  font-size: 14px;
  margin-top: var(--gap-5);
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--gap-4) 0;
  align-items: center;
  border-bottom: var(--border);
`;

export default WritingCondition;
