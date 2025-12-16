import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useState } from "react";

import InfoList from "../../components/atoms/lists/InfoList";
import Textarea from "../../components/atoms/Textarea";
import BottomNav from "../../components/layouts/BottomNav";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useFailToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IModal } from "../../types/components/modalTypes";
function RequestSecedeModal({ setIsModal }: IModal) {
  const toast = useToast();
  const failToast = useFailToast();

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [value, setValue] = useState("");
  const [text, setText] = useState("");

  const { mutate: changeRole, isLoading } = useUserInfoFieldMutation("role", {
    onSuccess() {
      toast("success", "탈퇴가 완료되었습니다.");
      signOut({ callbackUrl: "/login" });
    },
    onError(err) {
      console.error(err);
      failToast("error");
    },
  });

  const { mutate, isLoading: isLoading2 } = useUserRequestMutation();

  const handleBottomNav = () => {
    if (isFirstPage) setIsFirstPage(false);
    else {
      mutate({
        category: "탈퇴",
        title: value,
        content: text,
      });
      changeRole({ role: "secede" });
    }
  };

  const reasons = [
    "관심있는 모임이 활발하게 열리지 않아서",
    "원하는 관심사의 모임이 없어서",
    "맘에 들지 않는 멤버 또는 비매너 멤버를 만나서",
    "참여했던 활동이 만족스럽지 않아서",
    "함께할 수 있는 멤버가 별로 없어서 (나이/성별)",
    "서비스 이용에 기능적 불편함을 느껴서",
    "일정이 바빠져서 or 취업 준비를 해야 해서",
    "기타",
  ];

  return (
    <RightDrawer title="회원 탈퇴" onClose={() => setIsModal(false)}>
      <RegisterLayout isSlide={false} isNoPx>
        {isFirstPage ? (
          <>
            <RegisterOverview>
              <span>ABOUT을 탈퇴하시겠어요?</span>
              <span>나중을 위해 휴식 신청만 진행할 수도 있어요!</span>
            </RegisterOverview>
            <InfoList
              items={[
                "회원님의 모든 활동 정보와 기록이 삭제됩니다.",
                "이후 재가입시 가입비를 다시 지불해야 합니다.",
                "부정 이용 방지를 위해 탈퇴 후 30일간 재가입 할 수 없습니다.",
              ]}
            />
          </>
        ) : (
          <>
            <RegisterOverview>
              <span>탈퇴하시려는 이유를 선택해 주세요</span>
              <span>더 발전하는 ABOUT이 될 수 있도록 최선을 다하겠습니다.</span>
            </RegisterOverview>
            <RadioGroup onChange={setValue} value={value}>
              <Stack spacing="16px">
                {reasons.map((reason) => {
                  const needsTextarea =
                    reason === "맘에 들지 않는 멤버 또는 비매너 멤버를 만나서" || reason === "기타";

                  const showTextarea = needsTextarea && value === reason; // ✅ 핵심

                  return (
                    <Stack key={reason} spacing="12px">
                      <Radio value={reason} colorScheme="mint" alignItems="flex-start">
                        <Text fontSize="md" lineHeight="1.4">
                          {reason}
                        </Text>
                      </Radio>
                      {showTextarea && (
                        <Textarea
                          mt="0"
                          placeholder="해당 내용은 관리자만 확인합니다. 더 나은 어바웃이 될 수 있도록 소중한 의견 감사드립니다."
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
            </RadioGroup>{" "}
          </>
        )}
      </RegisterLayout>
      <BottomNav
        isSlide={false}
        onClick={handleBottomNav}
        text={isFirstPage ? "다 음" : "회원 탈퇴"}
        isLoading={isLoading || isLoading2}
      />
    </RightDrawer>
  );
}

export default RequestSecedeModal;
