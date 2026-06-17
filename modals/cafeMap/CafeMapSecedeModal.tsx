import { Checkbox, CheckboxGroup, Flex, Stack, Text } from "@chakra-ui/react";
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

function CafeMapSecedeModal({ setIsModal }: IModal) {
  const toast = useToast();
  const failToast = useFailToast();

  const [isFirstPage, setIsFirstPage] = useState(true);

  const [values, setValues] = useState<string[]>([]);
  const [textMap, setTextMap] = useState<Record<string, string>>({});

  const { mutate: changeRole, isLoading } = useUserInfoFieldMutation("role", {
    onSuccess() {
      toast("success", "탈퇴가 완료되었습니다.");
      signOut({ callbackUrl: "/cafe-map/login" });
    },
    onError(err) {
      console.error(err);
      failToast("error");
    },
  });

  const { mutate, isLoading: isLoading2 } = useUserRequestMutation();

  const handleBottomNav = () => {
    if (isFirstPage) {
      setIsFirstPage(false);
    } else {
      const content = values
        .map((reason) => {
          const extra = textMap[reason];
          return extra ? `${reason}: ${extra}` : reason;
        })
        .join("\n");

      mutate({
        category: "탈퇴",
        title: values.join(", "),
        content,
      });

      changeRole({ role: "secede" });
    }
  };

  const reasons = [
    "관심있는 카페 정보가 부족해서",
    "원하는 지역의 카페가 없어서",
    "앱 사용이 불편해서",
    "더 이상 카공을 하지 않아서",
    "기타",
  ];

  return (
    <RightDrawer title="회원 탈퇴" onClose={() => setIsModal(false)}>
      <Flex direction="column" h="calc(100dvh - var(--header-h))" overflow="hidden">
        <Flex flex={1} overflowY="auto" direction="column">
          <RegisterLayout isSlide={false} isNoPx>
            {isFirstPage ? (
              <>
                <RegisterOverview>
                  <span>카공지도를 탈퇴하시겠어요?</span>
                </RegisterOverview>

                <InfoList
                  items={[
                    "회원님의 모든 활동 정보와 기록이 삭제됩니다.",
                    "작성하신 카페 리뷰와 아카이브가 모두 삭제됩니다.",
                    "탈퇴 후 동일 계정으로 재가입할 수 있습니다.",
                  ]}
                />
              </>
            ) : (
              <>
                <RegisterOverview>
                  <span>탈퇴하시려는 이유를 선택해 주세요</span>
                  <span>더 발전하는 카공지도가 될 수 있도록 최선을 다하겠습니다.</span>
                </RegisterOverview>

                <CheckboxGroup value={values} onChange={(val) => setValues(val as string[])}>
                  <Stack spacing="16px">
                    {reasons.map((reason) => {
                      const needsTextarea = reason === "기타";
                      const showTextarea = needsTextarea && values.includes(reason);

                      return (
                        <Stack key={reason} spacing="12px">
                          <Checkbox value={reason} colorScheme="mint" alignItems="flex-start">
                            <Text fontSize="md" lineHeight="1.4">
                              {reason}
                            </Text>
                          </Checkbox>

                          {showTextarea && (
                            <Textarea
                              placeholder="해당 내용은 관리자만 확인합니다. 소중한 의견 감사드립니다."
                              fontSize="sm"
                              minH="100px"
                              value={textMap[reason] || ""}
                              onChange={(e) =>
                                setTextMap((prev) => ({
                                  ...prev,
                                  [reason]: e.target.value,
                                }))
                              }
                            />
                          )}
                        </Stack>
                      );
                    })}
                  </Stack>
                </CheckboxGroup>
              </>
            )}
          </RegisterLayout>
        </Flex>

        <BottomNav
          isSlide={false}
          onClick={handleBottomNav}
          text={isFirstPage ? "다 음" : "회원 탈퇴"}
          isLoading={isLoading || isLoading2}
        />
      </Flex>
    </RightDrawer>
  );
}

export default CafeMapSecedeModal;
