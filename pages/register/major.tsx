import { useToast } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { MAJORS_DATA } from "../../constants/contentsText/ProfileData";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { DispatchType } from "../../types/hooks/reactTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Major() {
  const toast = useToast();

  const info = getLocalStorageObj(REGISTER_INFO);

  const [majors, setMajors] = useState<{ department: string; detail: string }[]>(
    info?.majors || [],
  );

  const onClickNext = (e) => {
    if (!majors.length) {
      toast({
        title: "진행 불가",
        description: `전공을 선택해 주세요!`,
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
      <ProgressHeader title={"회원가입"} value={60} />
      <MajorLayout majors={majors} setMajors={setMajors} />
      <BottomNav onClick={onClickNext} url="/register/comment" />
    </>
  );
}

export function MajorLayout({
  majors,
  setMajors,
}: {
  majors: { department: string; detail: string }[];
  setMajors: DispatchType<{ department: string; detail: string }[]>;
}) {
  const toast = useToast();

  const onClickBtn = (department: string, detail: string) => {
    if (majors?.find((item) => item?.detail === detail)) {
      setMajors((old) => old.filter((item) => item.detail !== detail));
      return;
    }
    if (majors.length >= 2) {
      toast({
        title: "선택 불가",
        description: `2개까지만 선택이 가능해요`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setMajors((old) => [...old, { department, detail }]);
  };
  return (
    <RegisterLayout>
      <RegisterOverview>
        <span>전공을 선택해 주세요</span>
        <span>활동 추천을 위한 것으로, 복수 선택도 가능해요!</span>
      </RegisterOverview>
      {MAJORS_DATA?.map((item, idx) => (
        <Section key={idx}>
          <SectionTitle>{item.department}</SectionTitle>
          <SectionContent>
            {item.details?.map((detail, idx) => (
              <Content
                key={idx}
                $isSelected={Boolean(
                  majors?.find(
                    (majors) => majors.detail === detail && majors.department === item.department,
                  ),
                )}
                onClick={() => onClickBtn(item.department, detail)}
              >
                {detail}
              </Content>
            ))}
          </SectionContent>
        </Section>
      ))}
    </RegisterLayout>
  );
}

const Section = styled.section`
  margin-bottom: var(--gap-4);
`;

const SectionTitle = styled.span`
  font-weight: 600;
  font-size: 13px;
`;

const SectionContent = styled.div`
  margin-top: var(--gap-2);
  display: flex;
  flex-wrap: wrap;
`;

const Content = styled.button<{ $isSelected: boolean }>`
  padding: var(--gap-1) var(--gap-2);
  font-size: 12px;
  border-radius: 100px;
  border: var(--border-main);
  margin-right: var(--gap-2);
  margin-bottom: var(--gap-2);
  background-color: ${(props) => (props.$isSelected ? "var(--color-mint)" : "white")};
  color: ${(props) => props.$isSelected && "white"};
`;

export default Major;
