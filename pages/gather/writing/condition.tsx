import { Box, Flex, Stack, Switch } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import CountNum from "../../../components/atoms/CountNum";
import { Input } from "../../../components/atoms/Input";
import { PopOverIcon } from "../../../components/Icons/PopOverIcon";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useToast } from "../../../hooks/custom/CustomToast";
import GatherWritingConditionAgeRange from "../../../pageTemplates/gather/writing/condition/GatherWritingConditionAgeRange";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";

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
  const { data: session } = useSession();

  // const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const [gatherContent, setGatherContent] = useRecoilState(sharedGatherWritingState);
  const [condition, setCondition] = useState({
    gender: gatherContent?.genderCondition || false,
    age: gatherContent?.age ?? true,
    kakaoUrl: true,
    isApprove: gatherContent?.isApprovalRequired || false,
  });

  const [kakaoUrl, setKakaoUrl] = useState<string>(gatherContent?.kakaoUrl || "");
  const [age, setAge] = useState(gatherContent?.age || [19, 28]);
  const [maxCnt, setMaxCnt] = useState(gatherContent?.memberCnt?.max || 8);

  useEffect(() => {
    setGatherContent({ ...gatherContent, age, memberCnt: { min: 4, max: maxCnt } });
  }, [age, maxCnt]);

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
      genderCondition: condition.gender,
      user: session?.user.id,
      kakaoUrl,
      isApprovalRequired: condition.isApprove,
    };
    setGatherContent(gatherData);
    router.push({ pathname: `/gather/writing/image`, query: router.query });
  };

  const toggleSwitch = (e: ChangeEvent<HTMLInputElement>, type: GatherConditionType) => {
    const isChecked = e.target.checked;
    setCondition((old) => {
      return { ...old, [type]: isChecked };
    });
  };

  function RowBlock({
    children,
    isBorder = true,
  }: {
    children: React.ReactNode;
    isBorder?: boolean;
  }) {
    return (
      <Flex
        justify="space-between"
        align="center"
        py={3}
        borderBottom={isBorder ? "var(--border)" : "none"}
      >
        {children}
      </Flex>
    );
  }

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
          <Stack fontSize="14px">
            <RowBlock>
              <Flex lineHeight="20px">
                <Flex justify="center" w={5} h={5}>
                  <MemberIcon />
                </Flex>
                <Box ml={2}>최대 인원</Box>
              </Flex>

              <CountNum value={maxCnt} setValue={setMaxCnt} unit="명" isSmall />
            </RowBlock>

            <RowBlock>
              <Flex lineHeight="20px">
                <Flex justify="center" w={5} h={5}>
                  <Box>
                    <i
                      className="fa-sm fa-solid fa-venus-mars"
                      style={{ color: "var(--gray-600)" }}
                    />
                  </Box>
                </Flex>
                <Flex ml={2} align="center">
                  <Box mr={1}>성비 고려</Box>
                  <PopOverIcon text="성비를 최대 2대1까지로 제한합니다." />
                </Flex>
              </Flex>

              <Switch
                mr="var(--gap-1)"
                colorScheme="mint"
                isChecked={condition.gender}
                onChange={(e) => toggleSwitch(e, "gender")}
              />
            </RowBlock>
            <Box pb={2} borderBottom="var(--border)">
              <RowBlock isBorder={false}>
                <Flex lineHeight="20px">
                  <Flex justify="center" w={5} h={5}>
                    <UserIcon />
                  </Flex>
                  <Box ml={2}>나이(만)</Box>
                </Flex>
              </RowBlock>
              <GatherWritingConditionAgeRange age={age} setAge={setAge} />
            </Box>
            <RowBlock>
              <Flex lineHeight="20px">
                <Flex justify="center" w={5} h={5}>
                  <AccessIcon />
                </Flex>
                <Flex ml={2} align="center">
                  <Box mr={1}>참여 승인제</Box>
                  <PopOverIcon text="선착순 참여가 아니라 모임장이 승인하는 방식으로 진행됩니다." />
                </Flex>
              </Flex>

              <Switch
                mr="var(--gap-1)"
                colorScheme="mint"
                isChecked={condition.isApprove}
                onChange={(e) => toggleSwitch(e, "isApprove")}
              />
            </RowBlock>

            <RowBlock>
              <Flex lineHeight="20px">
                <Flex justify="center" w={5} h={5}>
                  <ChatRoomIcon />
                </Flex>
                <Flex ml={2} align="center">
                  <Box mr={1}>오픈 채팅방</Box>
                  <PopOverIcon text="참여 멤버들이 해당 톡방으로 입장합니다." />
                </Flex>
              </Flex>
              <Switch
                mr="var(--gap-1)"
                colorScheme="mint"
                isChecked={condition.kakaoUrl}
                onChange={(e) => toggleSwitch(e, "kakaoUrl")}
              />
            </RowBlock>
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
          </Stack>
        </RegisterLayout>
        <BottomNav onClick={() => onClickNext()} />
      </>
    </>
  );
}

function MemberIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-600)"
    >
      <path d="M40-272q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240v-32Zm698 112q11-18 16.5-38.5T760-240v-40q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v40q0 33-23.5 56.5T840-160H738ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-600)"
    >
      <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z" />
    </svg>
  );
}

function AccessIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-600)"
    >
      <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h360v-80q0-50-35-85t-85-35q-42 0-73.5 25.5T364-751q-4 14-16.5 22.5T320-720q-17 0-28.5-11t-8.5-26q11-68 66.5-115.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280Z" />
    </svg>
  );
}

function ChatRoomIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-600)"
    >
      <path d="M160-120q-17 0-28.5-11.5T120-160q0-17 11.5-28.5T160-200h40v-600q0-17 11.5-28.5T240-840h280q17 0 28.5 11.5T560-800h160q17 0 28.5 11.5T760-760v560h40q17 0 28.5 11.5T840-160q0 17-11.5 28.5T800-120h-80q-17 0-28.5-11.5T680-160v-560H560v560q0 17-11.5 28.5T520-120H160Zm320-360q0-17-11.5-28.5T440-520q-17 0-28.5 11.5T400-480q0 17 11.5 28.5T440-440q17 0 28.5-11.5T480-480Z" />
    </svg>
  );
}

export default WritingCondition;
