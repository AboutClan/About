import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";

import InfoList from "../../components/atoms/lists/InfoList";
import BottomNav from "../../components/layouts/BottomNav";
import Accordion from "../../components/molecules/Accordion";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import TabNav from "../../components/molecules/navs/TabNav";
import TextCheckButton from "../../components/molecules/TextCheckButton";
import ValueBoxCol2, { ValueBoxCol2ItemProps } from "../../components/molecules/ValueBoxCol2";
import { ACCORDION_CONTENT_FAQ } from "../../constants/contentsText/accordionContents";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation, useUserRegisterMutation } from "../../hooks/user/mutations";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Fee() {
  const errorToast = useErrorToast();
  const toast = useToast();
  const router = useRouter();

  const [tab, setTab] = useState<"신청 안내" | "자주 묻는 질문">("신청 안내");
  const [isChecked, setIsChecked] = useState(false);

  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const { mutate: changeRole } = useUserInfoFieldMutation("role");

  const { mutate, isLoading } = useUserRegisterMutation({
    onSuccess() {
      changeRole({ role: "waiting" });

      setLocalStorageObj(REGISTER_INFO, null);

      toast("success", "카카오 채널로 이동합니다.");
      router.push("/login");

      setTimeout(() => {
        window.location.href = `https://pf.kakao.com/_SaWXn/chat`;
      }, 500);
    },
    onError: errorToast,
  });

  const onClickNext = () => {
    if (info?.telephone.length < 11) {
      toast("error", "핸드폰 번호를 확인해 주세요.");
      return;
    }
    mutate(info);
  };

  const eventDay = dayjs().add(1, "weeks").day(7);

  const valueBoxColItems: ValueBoxCol2ItemProps[] = [
    {
      left: `가입비`,
      right: "10,000원",
      lineThroughText: "15,000원",
      leftSub: `(${dayjsToFormat(eventDay, "방학 중 인상 예정")})`,
    },
    {
      left: "보증금",
      right: "10,000원",
      leftSub: "(상시 환급 가능)",
    },
    {
      left: "총 금액",
      right: "= 20,000원 (보증금 포함)",
      isFinal: true,
    },
  ];

  return (
    <>
      <ProgressHeader title="회원 가입" value={100} />
      <RegisterLayout>
        <RegisterOverview>
          <span>최종 가입 신청</span>
          <span>아래 내용을 확인하신 후, 가입 신청을 완료할 수 있습니다.</span>
        </RegisterOverview>
        <TabNav
          isFullSize
          isBlack
          tabOptionsArr={[
            {
              text: "신청 안내",
              func: () => setTab("신청 안내"),
            },
            { text: "자주 묻는 질문", func: () => setTab("자주 묻는 질문") },
          ]}
        />
        <Box mt={5}>
          {tab === "신청 안내" ? (
            <Flex direction="column">
              <ValueBoxCol2 items={valueBoxColItems} />
              <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
                보증금은 다양한 활동에 사용할 수 있고, 탈퇴 시 환급됩니다.
              </Box>
              <Box mt={8} mb={5}>
                <Box ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                  Q) 신청 완료 후에는 어떻게 하나요?
                </Box>
                <InfoList items={INFO_ARR} />
              </Box>
              <TextCheckButton
                text="위 내용을 확인했고, 가입을 진행합니다."
                isChecked={isChecked}
                toggleCheck={() => setIsChecked((old) => !old)}
              />
            </Flex>
          ) : (
            <Accordion contentArr={ACCORDION_CONTENT_FAQ} />
          )}
        </Box>
      </RegisterLayout>
      <BottomNav
        isLoading={isLoading}
        onClick={onClickNext}
        text="가입 신청 완료"
        isActive={isChecked}
      />
    </>
  );
}

const INFO_ARR = [
  "신청을 완료하면 About 카카오 채널로 이동됩니다.",
  "카카오 채널에서 [신청 완료] 버튼을 눌러주세요 !",
  "입금까지 완료하시면 바로 동아리 활동을 시작할 수 있습니다.",
];

export default Fee;
