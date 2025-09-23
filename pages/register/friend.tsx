import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { Input } from "../../components/atoms/Input";
import InfoList from "../../components/atoms/lists/InfoList";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import TextCheckButton from "../../components/molecules/TextCheckButton";
import { USER_INFO } from "../../constants/keys/queryKeys";
import { useAdminPointMutation } from "../../hooks/admin/mutation";
import { useToast } from "../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../hooks/user/queries";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";

function Friend() {
  const { data: session } = useSession();

  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [value, setValue] = useState("");

  const { data } = useUserInfoQuery();

  const { data: logs } = usePointSystemLogQuery("point");

  const { mutate: updatePoint } = usePointSystemMutation("point", {
    onSuccess() {
      toast("success", "성공적으로 충전되었습니다.");
      queryClient.invalidateQueries([USER_INFO]);
      router.push("/home");
    },
    onError() {
      toast("error", "오류 발생. About 채널에 문의해 주세요.");
    },
  });

  const { mutate, isLoading } = useAdminPointMutation(value, {
    onSuccess() {
      updatePoint({ value: 3000, message: "친구 초대 보상" });
    },
    onError() {
      toast("error", "추천인 코드가 정확하지 않습니다.");
    },
  });

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (session === undefined || !data) return;
    if (!session?.user.uid) {
      toast("error", "계정 확인을 위해 다시 로그인해주세요.");
      router.push("/login?status=friend");
    }

    if (data.role !== "human" && data.role !== "member") {
      toast("error", "동아리 가입 확정 이후에 입력할 수 있습니다.");
      router.push("/login");
    }
  }, [session, data]);

  const onClickNext = () => {
    if (dayjs(data?.registerDate).isBefore(dayjs().subtract(3, "d"))) {
      toast("error", "가입한지 3일 이상이 지났습니다.");
      return;
    }
    if (logs?.find((log) => log.message === "친구 초대 보상")) {
      toast("error", "이미 추천인을 입력하셨습니다.");
      return;
    }
    mutate({ value: 3000, message: "친구 초대 보상" });
  };

  return (
    <>
      <Header title="친구 초대" url="/home" />
      <RegisterLayout>
        <RegisterOverview>
          <span>친구 초대 보상</span>
          <span>아래 코드를 입력하시면, 친구 초대 보상을 받을 수 있습니다.</span>
        </RegisterOverview>

        <Box mt={5}>
          <Flex direction="column">
            <Flex align="center" ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
              ✅ 추천인 코드 입력
            </Flex>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="코드 입력"
            />
            <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
              가입 후 3일 이내까지만 입력할 수 있습니다.
            </Box>
            <Box mt={8} mb={5}>
              <Box ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                ‼️ 주의사항 안내 ‼️
              </Box>
              <InfoList items={INFO_ARR} />
            </Box>
            <TextCheckButton
              text="위 내용을 확인하셨나요?"
              isChecked={isChecked}
              toggleCheck={() => setIsChecked((old) => !old)}
            />
          </Flex>
        </Box>
      </RegisterLayout>
      <BottomNav
        isLoading={isLoading}
        onClick={onClickNext}
        text="입력 완료"
        isActive={isChecked}
      />
    </>
  );
}

const INFO_ARR = [
  "전달받은 코드를 입력하고, [입력 완료] 버튼을 눌러주세요!",
  "두 분 모두에게 3,000 Point가 지급됩니다.",
  "실제 친구 추천이 아닌 경우, 동아리에서 '영구' 제명됩니다.",
];

export default Friend;
