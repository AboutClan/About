import { Input } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { MESSAGE_DATA } from "../../constants/contentsText/ProfileData";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useCompleteToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Comment() {
  const searchParams = useSearchParams();
  const typeToast = useTypeToast();
  const completeToast = useCompleteToast();
  const router = useRouter();

  const info = getLocalStorageObj(REGISTER_INFO);

  const isProfileEdit = !!searchParams.get("edit");
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(info?.comment || "");

  const [index, setIndex] = useState<number>();

  const queryClient = useQueryClient();

  const { data: userInfo } = useUserInfoQuery({ enabled: isProfileEdit });
  const { mutate: updateUserInfo } = useUserInfoMutation({
    onSuccess() {
      setLocalStorageObj(REGISTER_INFO, null);
      queryClient.invalidateQueries([USER_INFO]);
      router.replace("/user");
      completeToast("free", "변경되었습니다.");
    },
    onError: () => typeToast("error"),
  });

  const InputIdx = MESSAGE_DATA?.length;

  const onClickNext = () => {
    if (index === null && value === "") {
      setErrorMessage("문장을 선택해 주세요.");
      return;
    }
    let tempComment = "";
    if (index === InputIdx || index === null) tempComment = value;
    else tempComment = MESSAGE_DATA[index];

    setLocalStorageObj(REGISTER_INFO, { ...info, comment: tempComment });

    if (isProfileEdit) {
      updateUserInfo({
        ...userInfo,
        ...info,
        comment: tempComment,
      });
    } else router.push(`/register/phone`);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (!index && value !== "") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [index, value]);

  return (
    <>
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={80} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>자기 소개 문장을 입력해 주세요</span>
          <span>나를 소개하는 문장을 선택하거나 직접 입력해 주세요.</span>
        </RegisterOverview>
        <Container>
          {MESSAGE_DATA?.map((item, idx) => (
            <Item key={idx} onClick={() => setIndex(idx)} $isSelected={idx === index}>
              {item}
            </Item>
          ))}
        </Container>

        <div onClick={() => setIndex(InputIdx)}>
          <Input
            placeholder="직접 입력"
            ref={inputRef}
            onChange={(e) => setValue(e.target?.value)}
            value={value}
            h="48px"
            color="var(--gray-4)"
            focusBorderColor="#00c2b3"
            textAlign="center"
            fontSize="14px"
            borderWidth="1.5px"
            _placeholder={{
              color: "var(--gray-4)",
            }}
          />
        </div>
      </RegisterLayout>

      <BottomNav
        onClick={onClickNext}
        text={isProfileEdit ? "완료" : null}
        url={!isProfileEdit && "/register/phone"}
      />
    </>
  );
}

const Container = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
`;

const Item = styled.div<{ $isSelected: boolean }>`
  width: 100%;
  border-radius: var(--rounded-lg);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  margin-bottom: var(--gap-3);
  color: ${(props) => (props.$isSelected ? "var(--gray-1)" : "var(--gray-4)")};
  border: ${(props) => (props.$isSelected ? "var(--border-thick)" : "1.5px solid var(--gray-6)")};
`;

export default Comment;
