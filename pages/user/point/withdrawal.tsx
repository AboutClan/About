import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import InfoList from "../../../components/atoms/lists/InfoList";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import LabeledInput from "../../../components/molecules/LabeledInput";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";

function WithDrawel() {
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();

  const { data: userInfo } = useUserInfoQuery();

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const { mutate } = useUserRequestMutation({
    onSuccess() {
      typeToast("apply");
      router.push("/user");
    },
  });

  const handleSubmit = () => {
    if (!value1 || !value2) {
      toast("warning", "내용을 확인해 주세요");
      return;
    }

    mutate({
      category: "출금",
      title: "포인트 출금 신청",
      content: `${value1} / ${value2}`,
    });
  };
  return (
    <>
      <Header title="포인트 출금" />
      <Slide>
        <Box h="54px" />
        <RegisterOverview>
          <span>포인트 출금 신청</span>
          <span>아래 정보를 정확하게 입력해 주세요</span>
        </RegisterOverview>
        <Box py={3} mb={5} mt={-5}>
          <Box fontSize="11px">{userInfo?.name.slice(1)}님의 보유 포인트</Box>
          <Box fontSize="20px" fontWeight="semibold" color="mint">
            {userInfo?.point} Point
          </Box>
        </Box>
        <Box fontSize="12px">
          <Box mb={4}>
            <LabeledInput
              label="계좌 번호"
              placeholder="ex) 000-00-0000 (기업)"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
            />
          </Box>
          <Box mb={4}>
            <LabeledInput
              label="출금 희망 금액(1,000원 단위)"
              placeholder="ex) 3000"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
            />
          </Box>
        </Box>
        <Box mt={10}>
          <InfoList items={INFO_ARR} />
        </Box>
      </Slide>
      <BottomNav onClick={handleSubmit} text="완 료" />
    </>
  );
}
const INFO_ARR = [
  "포인트 출금 시 10% 수수료가 발생합니다.",
  "출금 후 잔액이 최소 5,000원 이상이어야 합니다.",
  "탈퇴를 위한 출금의 경우, 출금이 아닌 탈퇴 신청을 해주세요.",
];

export default WithDrawel;
