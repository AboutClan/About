import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import Textarea from "../../components/atoms/Textarea";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

const ROUTES = ["에브리타임", "캠퍼스픽", "지인 추천", "인스타그램", "기타"];

function Mbti() {
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const initialRoute = typeof info?.route === "string" ? info.route : "";

  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(initialRoute);
  const [text, setText] = useState("");

  const onClickNext = () => {
    if (!value) {
      setErrorMessage("알게 된 경로를 선택해 주세요.");
      return;
    }

    if (value === "기타" && !text) {
      setErrorMessage("기타 내용을 입력해 주세요.");
      return;
    }

    const finalValue = value === "기타" ? `기타: ${text}` : value;

    setLocalStorageObj(REGISTER_INFO, {
      ...info,
      route: finalValue,
    });
  };

  return (
    <>
      <ProgressHeader title="회원가입 " value={92} />

      <MBTILayout
        value={value}
        setValue={setValue}
        text={text}
        setText={setText}
        errorMessage={errorMessage}
      />

      <BottomNav onClick={onClickNext} url="/register/introduce" />
    </>
  );
}

export function MBTILayout({
  value,
  setValue,
  text,
  setText,
  errorMessage,
}: {
  value: string;
  setValue: (v: string) => void;
  text: string;
  setText: (v: string) => void;
  errorMessage: string;
}) {
  return (
    <RegisterLayout errorMessage={errorMessage}>
      <RegisterOverview>
        <span>어바웃을 어떻게 알게됐나요?</span>
        <span>알게된 경로를 선택해 주세요!</span>
      </RegisterOverview>

      <RadioGroup onChange={setValue} value={value}>
        <Stack spacing="16px">
          {ROUTES.map((route) => {
            const showTextarea = route === "기타" && value === "기타";

            return (
              <Stack key={route} spacing="12px">
                <Radio value={route} colorScheme="mint" alignItems="flex-start">
                  <Text fontSize="md" lineHeight="1.4">
                    {route}
                  </Text>
                </Radio>

                {showTextarea && (
                  <Textarea
                    placeholder="자유롭게 입력해 주세요!"
                    fontSize="sm"
                    minH="100px"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                )}
              </Stack>
            );
          })}
        </Stack>
      </RadioGroup>
    </RegisterLayout>
  );
}

export default Mbti;
