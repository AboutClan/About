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
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Major() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const isProfileEdit = !!searchParams.get("edit");

  const info = getLocalStorageObj(REGISTER_INFO);

  const [majors, setmajors] = useState<{ department: string; detail: string }[]>(
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

  const onClickBtn = (department: string, detail: string) => {
    if (majors?.find((item) => item?.detail === detail)) {
      setmajors((old) => old.filter((item) => item.detail !== detail));
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
    setmajors((old) => [...old, { department, detail }]);
  };

  return (
    <>
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={60} />

      <RegisterLayout>
        <RegisterOverview>
          <span>전공을 선택해 주세요</span>
          <span>다중 선택도 가능해요.</span>
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
      <BottomNav onClick={onClickNext} url="/register/interest" />
    </>
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
  border: 1px solid var(--gray-400);
  margin-right: var(--gap-2);
  margin-bottom: var(--gap-2);
  background-color: ${(props) => props.$isSelected && "var(--color-mint)"};
  color: ${(props) => props.$isSelected && "white"};
`;

export default Major;
