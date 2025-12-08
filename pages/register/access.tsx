import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import InfoList from "../../components/atoms/lists/InfoList";
import { CopyBtn } from "../../components/Icons/CopyIcon";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import TextCheckButton from "../../components/molecules/TextCheckButton";
import ValueBoxCol2 from "../../components/molecules/ValueBoxCol2";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserRegisterControlMutation } from "../../hooks/user/mutations";
import { gaEvent } from "../../libs/gtag";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { ACCOUNT_TEXT } from "../user/point/charge";
import { VALUE_BOX_COL_ITEMS } from "./fee";

function Access() {
  const { data: session } = useSession();

  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (session === undefined) return;

    if (!session?.user.uid) {
      toast("error", "계정 확인을 위해 다시 로그인해주세요.");
      router.push("/login?status=access");
    }
  }, [session]);

  const { mutate: approve, isLoading } = useUserRegisterControlMutation("post", {
    onSuccess() {
      gaEvent("sign_up_complete");
      toast("success", "가입이 승인되었습니다!");
      queryClient.resetQueries([USER_INFO]);
      router.push("/home");
      setTimeout(() => {
        navigateExternalLink("https://pf.kakao.com/_SaWXn/109551233");
      }, 500);
    },
    onError() {
      toast("error", "계정 확인을 위해 다시 로그인해주세요.");
      router.push("/login?status=access");
    },
  });

  const onClickNext = () => {
    approve(session.user.uid);
  };

  return (
    <>
      <Header title="가입 완료" url="/login?status=access" />
      <RegisterLayout>
        <RegisterOverview>
          <span>활동 시작 안내</span>
          <span>동아리 회비 입금을 마치면, 바로 활동을 시작하실 수 있습니다.</span>
        </RegisterOverview>

        <Box mt={5}>
          <Flex direction="column">
            <Flex align="center" ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
              ✅ 회비 안내
            </Flex>
            <ValueBoxCol2 items={VALUE_BOX_COL_ITEMS} />
            <Flex mt={5} align="center" ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
              ✅ 입금 계좌
            </Flex>
            <Flex
              fontSize="13px"
              px={4}
              py={3}
              bg="rgba(0,194,179,0.02)"
              borderRadius="16px"
              border="1px solid rgba(0,194,179,0.08)"
            >
              <Box mr={2}>{ACCOUNT_TEXT}</Box>
              <CopyBtn text={ACCOUNT_TEXT} />
            </Flex>
            <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
              위 계좌로 20,000원을 입금 후, [활동 시작] 버튼을 눌러주세요!
            </Box>

            <Box mt={8} mb={5}>
              <Box ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                ⚠️ 주의사항 ⚠️
              </Box>
              <InfoList items={INFO_ARR} />
            </Box>
            <TextCheckButton
              text="위 내용을 확인했고, 입금을 마쳤습니다."
              isChecked={isChecked}
              toggleCheck={() => setIsChecked((old) => !old)}
            />
          </Flex>
        </Box>
      </RegisterLayout>
      <BottomNav
        isLoading={isLoading}
        onClick={onClickNext}
        text="동아리 활동 시작하기"
        isActive={isChecked}
      />
    </>
  );
}

const INFO_ARR = [
  "회비 입금을 완료한 뒤에, [활동 시작] 버튼을 눌러주세요.",
  "가입 후에는 [신규 인원 가이드]를 확인해 주세요!",
  "포인트는 모임 참여 등 서비스 이용 재화로, 환불되지 않습니다.",
  "입금하지 않고 누르는 경우, 동아리에서 영구 제명됩니다.",
];

export default Access;
