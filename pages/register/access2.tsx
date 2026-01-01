import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQueryClient } from "react-query";

import InfoList from "../../components/atoms/lists/InfoList";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import ValueBoxCol2 from "../../components/molecules/ValueBoxCol2";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserRegisterControlMutation } from "../../hooks/user/mutations";
import { gaEvent } from "../../libs/gtag";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { VALUE_BOX_COL_ITEMS } from "./fee";

function Access() {
  const { data: session } = useSession();

  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

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

  console.log(approve);

  const onClickNext = () => {
    if (!session?.user.uid) {
      toast("error", "계정 확인을 위해 다시 로그인해주세요.");
      router.push("/login?status=access");
      return;
    }
    router.push({
      pathname: "/payment/join-fee",
      query: {
        uid: session.user.uid,
        amount: 20000,
        source: "access",
      },
    });
    // approve(session.user.uid);
  };

  return (
    <>
      <Header title="가입 완료" url="/login?status=access" />
      <RegisterLayout>
        <RegisterOverview>
          <span>활동 시작 안내</span>
          <span>회비 입금을 마치면, 바로 활동을 시작할 있습니다.</span>
        </RegisterOverview>

        <Box mt={5}>
          <Flex direction="column">
            <Flex align="center" ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
              ✅ 회비 안내
            </Flex>
            <ValueBoxCol2 items={VALUE_BOX_COL_ITEMS} />
            {/* <Box fontSize="10px" ml="auto" mt={2} color="gray.500">
              * 위 내용은 결제일로부터 1년간 유효합니다.
            </Box> */}
            {/* 
            <Box mt={8} mb={5}>
              <Box ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                ⚠️ 확인사항 ⚠️
              </Box>
              <InfoList items={INFO_ARR} />
            </Box> */}
            <Box mt={5} mb={5}>
              <Box ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                ⚠️ 유의사항 ⚠️
              </Box>
              <InfoList items={INFO_ARR2} />
            </Box>
            {/* <TextCheckButton
              text="위 내용을 확인했고, 입금을 마쳤습니다."
              isChecked={isChecked}
              toggleCheck={() => setIsChecked((old) => !old)}
            /> */}
          </Flex>
        </Box>
      </RegisterLayout>
      <BottomNav isLoading={isLoading} onClick={onClickNext} text="결제하고 활동 시작하기" />
    </>
  );
}

// const INFO_ARR = [
//   "가입 후에는 [신규 인원 가이드]를 확인해 주세요!",
//   "다른 회원에게 불편함을 줄 수 있는 모든 행위에 대해 패널티가 부여될 수 있습니다. 일방적인 연락, 무례한 언행, 종교 권유 등 불편함을 겪었다면 해당 멤버 프로필에서 '신고하기'를 이용해 주세요. 운영진의 판단에 따라 사전 경고 없이 활동이 제한되거나 강제 탈퇴될 수 있습니다.",
// ];
const INFO_ARR2 = [
  "결제 즉시 이용이 시작되며, 7일 내 미이용 시에만 환불됩니다.",
  "포인트는 모임 참여 등 서비스 이용 재화로, 환불되지 않습니다.",
];

export default Access;
