import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import RegisterOverview from "../register/RegisterOverview";

type StudyStyleProps = {
  style: string | null;
  tool: string | null;
  subject: string | null;
};

type StudyIntroduceDrawerProps = {
  onClose: () => void;
};

type StudyInfoKey = keyof StudyStyleProps;
const STUDY_INTRODUCE = {
  styles: [
    "[쉬엄쉬엄] 공부하다가 편하게 대화해도 좋아요!",
    "[밸런스] 공부할 땐 집중하고, 중간중간 쉬면서 대화하는 걸 좋아해요.",
    "[몰입형] 적당한 대화도 좋지만, 개인 작업에 더 집중하는 걸 선호해요.",
  ],
  tools: ["노트북 위주로 사용해요", "책, 필기도구 위주로 사용해요", "그 외"],
  subjects: [
    "코딩",
    "전공 공부",
    "취업 준비",
    "토익",
    "오픽",
    "기사 시험",
    "대학원 준비",
    "디자인 작업",
    "외국어 공부",
    "포트폴리오",
    "프로젝트",
    "과제",
    "직장 업무",
    "개인 업무",
    "자격증",
    "독서",
    "기타",
  ],
};
const SELECT_ITEMS = [
  {
    key: "style",
    title: "어떤 공부 스타일을 선호하시나요?",
    options: STUDY_INTRODUCE.styles,
    flexDir: "column",
  },
  {
    key: "tool",
    title: "어떤 것을 사용하시나요?",
    options: STUDY_INTRODUCE.tools,
    flexDir: "row",
  },
  {
    key: "subject",
    title: "어떤 공부를 주로 하시나요?",
    options: STUDY_INTRODUCE.subjects,
    flexDir: "row",
  },
] as const;

function StudyIntroduceDrawer({ onClose }: StudyIntroduceDrawerProps) {
  const toast = useToast();
  const [infos, setInfos] = useState<StudyStyleProps>({
    style: null,
    tool: null,
    subject: null,
  });

  const handleSelect = (key: StudyInfoKey, value: string) => {
    setInfos((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const { mutate,isLoading} = useUserInfoFieldMutation("studyIntroduce", {
    onSuccess() {
      toast("success", "입력이 완료되었어요!");
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!infos.style || !infos.tool || !infos.subject) {
      toast("info", "선택하지 않은 항목이 있어요!");
      return;
    }
    mutate({
      studyIntroduce: {
        subject: infos.subject,
        studyStyle: infos.style,
        studyTool: infos.tool,
      },
    });
  };

  return (
    <RightDrawer onClose={onClose} title="">
      <RegisterOverview>
        <span>스터디 정보를 입력해 주세요</span>
        <span>참여자끼리 관심사와 공부 스타일을 확인할 수 있어요.</span>
      </RegisterOverview>
      <Box>
        {SELECT_ITEMS.map(({ key, title, options, flexDir }) => (
          <StudySelectSection
            key={key}
            title={title}
            options={options ?? []}
            selectedValue={infos[key]}
            flexDir={flexDir}
            onSelect={(value) => handleSelect(key, value)}
          />
        ))}
      </Box>{" "}
          <BottomNav onClick={handleSubmit} text="완 료" isLoading={isLoading} />
    </RightDrawer>
  );
}

type StudySelectSectionProps = {
  title: string;
  options: string[];
  selectedValue: string | null;
  flexDir?: "row" | "column";
  onSelect: (value: string) => void;
};

function StudySelectSection({
  title,
  options,
  selectedValue,
  flexDir = "row",
  onSelect,
}: StudySelectSectionProps) {
  return (
    <Box mb={8}>
      <Text as="span" fontWeight={600} fontSize="15px">
        <b>Q.</b> {title}
      </Text>

      <Flex mt={3} flexWrap="wrap" flexDir={flexDir} align="start">
        {options.map((option) => {
          const isSelected = selectedValue === option;

          return (
            <Button
              key={option}
              type="button"
              variant="outline"
              size="sm"
              px={2}
              py={1}
              mr={2}
              mb={2}
              minH="auto"
              h="auto"
              fontSize="12px"
              fontWeight={400}
              borderRadius="full"
              borderColor="inherit"
              bg={isSelected ? "mint" : "white"}
              color={isSelected ? "white" : "inherit"}
              _hover={{
                bg: isSelected ? "mint" : "white",
              }}
              _active={{
                bg: isSelected ? "mint" : "white",
              }}
              onClick={() => onSelect(option)}
            >
              {option}
            </Button>
          );
        })}
      </Flex>
    </Box>
  );
}

export default StudyIntroduceDrawer;
