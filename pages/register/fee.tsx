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
import { gaEvent } from "../../libs/gtag";
import { ModalLayout } from "../../modals/Modals";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

export const VALUE_BOX_COL_ITEMS: ValueBoxCol2ItemProps[] = [
  {
    left: `동아리 가입비`,
    right: "10,000원",
    lineThroughText: "15,000원",
    leftSub: `(${dayjs().add(1, "month").month() + 1}월 중 인상 예정)`,
  },
  {
    left: "포인트 충전",
    right: "10,000원",
    leftSub: "(활동에 쓰이는 재화)",
  },
  {
    left: "최종 결제 금액",
    right: "= 20,000원",
    isFinal: true,
  },
];

function Fee() {
  const errorToast = useErrorToast();
  const toast = useToast();
  const router = useRouter();

  const [tab, setTab] = useState<"신청 안내" | "자주 묻는 질문">("신청 안내");
  const [isChecked, setIsChecked] = useState(false);
  const [isModal, setIsMomdal] = useState(false);

  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const { mutate: changeRole } = useUserInfoFieldMutation("role");

  const { mutate, isLoading } = useUserRegisterMutation({
    onSuccess() {
      const moving = localStorage.getItem("moving");
      if (moving) gaEvent("register_complete_by_cafe_map");
      else gaEvent("register_complete");
      changeRole({ role: "waiting" });

      setLocalStorageObj(REGISTER_INFO, null);
      setIsMomdal(true);
    },
    onError: errorToast,
  });

  const onClickNext = () => {
    if (info.name === "게스트" || info.name === "테스트") {
      router.push(`/register/access2`);
      return;
    }
    if (info?.telephone.length < 11) {
      toast("error", "핸드폰 번호를 확인해 주세요.");
      return;
    }

    mutate(info);
  };

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
              <ValueBoxCol2 items={VALUE_BOX_COL_ITEMS} />
              {/* <Box fontSize="10px" ml="auto" mt={2} color="gray.500">
                * 위 내용은 결제일로부터 1년간 유효합니다.
              </Box> */}
              <Box mt={5} mb={5}>
                <Box ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                  Q) 신청 완료 후에는 어떻게 하나요?
                </Box>
                <InfoList items={INFO_ARR} />
              </Box>
              <TextCheckButton
                text="위 내용을 확인했습니다."
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
      {isModal && (
        <ModalLayout
          isDark
          title="가입 신청 완료"
          setIsModal={null}
          isCloseButton={false}
          footerOptions={{
            main: {
              text: "회비 납부하고 활동 시작하기",
              func: () => {
                router.push("/register/access");
              },
            },
            // sub: {
            //   text: "카카오 채널로 이동",
            //   func: () => {
            //     toast("success", "카카오 채널로 이동합니다.");
            //     router.push("/login");
            //     setTimeout(() => {
            //       navigateExternalLink("https://pf.kakao.com/_SaWXn/chat");
            //     }, 500);
            //   },
            // },
          }}
        >
          <p>
            신청이 완료되었어요!
            <br /> 활동을 시작하려면 아래 버튼을 눌러주세요!
          </p>
        </ModalLayout>
      )}
    </>
  );
}

const INFO_ARR = [
  "신청을 완료하면 회비 납부 페이지로 이동됩니다.",
  "회비 납부를 마치면 동아리 활동을 시작할 수 있습니다.",
  "가입 후에는 신규 인원 가이드를 꼭 확인해 주세요!",
];

export default Fee;
