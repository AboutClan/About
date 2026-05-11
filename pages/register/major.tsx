import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { MouseEvent, useState } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { MAJORS_DATA } from "../../constants/contentsText/ProfileData";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { DispatchType } from "../../types/hooks/reactTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

type MajorItem = {
  department: string;
  detail: string;
};

function Major() {
  const toast = useToast();
  const info = getLocalStorageObj(REGISTER_INFO);

  const [majors, setMajors] = useState<MajorItem[]>(info?.majors || []);

  const onClickNext = (e: MouseEvent) => {
    if (!majors.length) {
      toast({
        title: "진행 불가",
        description: "전공을 선택해 주세요!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      e.preventDefault();
      return;
    }

    setLocalStorageObj(REGISTER_INFO, { ...info, majors });
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={75} />
      <MajorLayout majors={majors} setMajors={setMajors} />
      <BottomNav onClick={onClickNext} url="/register/comment" />
    </>
  );
}

export function MajorLayout({
  majors,
  setMajors,
}: {
  majors: MajorItem[];
  setMajors: DispatchType<MajorItem[]>;
}) {
  const toast = useToast();

  const onClickBtn = (department: string, detail: string) => {
    const isSelected = majors.some(
      (major) => major.department === department && major.detail === detail,
    );

    if (isSelected) {
      setMajors((prev) =>
        prev.filter((major) => !(major.department === department && major.detail === detail)),
      );
      return;
    }

    if (majors.length >= 2) {
      toast({
        title: "선택 불가",
        description: "2개까지만 선택이 가능해요",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    setMajors((prev) => [...prev, { department, detail }]);
  };

  return (
    <RegisterLayout>
      <RegisterOverview>
        <span>전공을 선택해 주세요</span>
        <span>활동 추천을 위한 것으로, 복수 선택도 가능해요!</span>
      </RegisterOverview>

      {MAJORS_DATA?.map((item) => (
        <Box as="section" key={item.department} mb={4}>
          <Text as="span" fontWeight={600} fontSize="13px">
            {item.department}
          </Text>

          <Flex mt={2} flexWrap="wrap">
            {item.details?.map((detail) => {
              const isSelected = majors.some(
                (major) => major.department === item.department && major.detail === detail,
              );

              return (
                <Button
                  key={`${item.department}-${detail}`}
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
                  onClick={() => onClickBtn(item.department, detail)}
                >
                  {detail}
                </Button>
              );
            })}
          </Flex>
        </Box>
      ))}
    </RegisterLayout>
  );
}

export default Major;
