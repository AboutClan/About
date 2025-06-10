import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import InfoList from "../../components/atoms/lists/InfoList";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import TextCheckButton from "../../components/molecules/TextCheckButton";
import ValueBoxCol from "../../components/molecules/ValueBoxCol";
import { ValueBoxCol2ItemProps } from "../../components/molecules/ValueBoxCol2";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserRegisterControlMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";

function Access() {
  const { data: session } = useSession();

  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useUserInfoQuery();

  const [isChecked, setIsChecked] = useState(false);
  console.log(12, data, session);
  useEffect(() => {
    if (session === undefined) return;

    if (!session?.user.uid) {
      toast("error", "계정 확인을 위해 다시 로그인해주세요.");
      router.push("/login?status=access");
    }
  }, [session]);

  const { mutate: approve, isLoading } = useUserRegisterControlMutation("post", {
    onSuccess() {
      toast("success", "가입이 승인되었습니다!");
      queryClient.resetQueries([USER_INFO]);
      router.push("/home");
    },
    onError() {
      toast("error", "계정 확인을 위해 다시 로그인해주세요.");
      router.push("/login?status=access");
    },
  });

  const onClickNext = () => {
    approve(session.user.uid);
  };

  const valueBoxColItems: ValueBoxCol2ItemProps[] = [
    {
      left: `입금 보증금`,
      right: "10,000원",
    },
    {
      left: "카카오 채널 친구 추가",
      right: "2,000원",
    },
    {
      left: "가입 후 자기소개 작성",
      right: "1,000원",
    },
    {
      left: "최종 보유 포인트",
      right: "= 13,000원",
      isFinal: true,
    },
  ];

  return (
    <>
      <Header title="가입 완료" url="/login?status=access" />
      <RegisterLayout>
        <RegisterOverview>
          <span>최종 가입 완료</span>
          <span>아래 내용을 확인하신 후, 동아리 활동을 시작할 수 있습니다.</span>
        </RegisterOverview>

        <Box mt={5}>
          <Flex direction="column">
            <Flex align="center" ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
              ✅ 보증금(포인트) 안내
            </Flex>
            <ValueBoxCol items={valueBoxColItems} />
            <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
              카카오 채널 친구 추가 쿠폰은 직접 사용해야 충전됩니다.
            </Box>
            <Box mt={8} mb={5}>
              <Box ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                ‼️ 주의사항 안내 ‼️
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
  "회비 입금을 완료한 뒤에, [활동 시작] 버튼을 눌러주세요!",
  "모든 신규 인원의 회비 입금 내역을 확인하고 있습니다.",
  "입금하지 않고 누르는 경우, 동아리에서 '영구' 제명됩니다.",
];

export default Access;
