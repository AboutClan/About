import { Box, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";

import CountNum from "../../../components/atoms/CountNum";
import InfoList from "../../../components/atoms/lists/InfoList";
import { CopyBtn } from "../../../components/Icons/CopyIcon";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import TextCheckButton from "../../../components/molecules/TextCheckButton";
import ValueBoxCol, { ValueBoxColItemProps } from "../../../components/molecules/ValueBoxCol";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

const ACCOUNT_TEXT = "우리은행 1002364221277 (어바웃)";

function Charge() {
  const router = useRouter();
  const toast = useToast();

  const [isChecked, setIsChecked] = useState(false);

  const { data: userInfo } = useUserInfoQuery();

  const [point, setPoint] = useState(5000);

  const queryClient = useQueryClient();
  const { mutate: updatePoint, isLoading: isLoading1 } = usePointSystemMutation("point", {
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      toast("success", "충전이 완료되었습니다.");
    },
  });

  const { mutate, isLoading: isLoading2 } = useUserRequestMutation({
    onSuccess() {
      router.push("/user");
    },
  });

  const valueBoxColItems: ValueBoxColItemProps[] = [
    {
      left: "보유 포인트",
      right: userInfo?.point?.toLocaleString() + " Point",
    },
    {
      left: `충전 포인트`,
      right: point?.toLocaleString() + " Point",
    },

    {
      left: "최종 포인트",
      right: (userInfo?.point + point)?.toLocaleString() + " Point",
      isFinal: true,
    },
  ];

  const handleSubmit = () => {
    if (!isChecked) {
      toast("warning", "입금 여부를 체크해 주세요!");
      return;
    }
    updatePoint({ value: point, message: "포인트 충전", sub: "charge" });

    mutate({
      category: "충전",
      title: "포인트 충전",
      content: dayjsToFormat(dayjs(), "M월 D일 H시 m분") + "/" + point.toLocaleString() + "원",
    });
  };

  return (
    <>
      <Header title="정산 받기" />
      <Slide>
        <Box h="54px" />
        <RegisterOverview>
          <>
            <span>포인트 충전</span>
            <span>About 활동에 필요한 포인트를 충전할 수 있습니다</span>
          </>
        </RegisterOverview>

        <>
          <Box mt={5}>
            <Flex direction="column">
              <Flex justify="center">
                <CountNum
                  value={point}
                  setValue={(newValue) => {
                    setPoint(newValue);
                  }}
                  stepValue={1000}
                  min={1000}
                  unit="원"
                  size="lg"
                />
              </Flex>
              <Box mt={5}>
                <ValueBoxCol items={valueBoxColItems} />
              </Box>
              <Box as="li" fontSize="12px" lineHeight="20px" mt="8px" color="gray.600">
                아래 계좌로 {point.toLocaleString()}원을 입금해 주세요!
              </Box>
              <Text mt={5} fontSize="11px" fontWeight="medium" color="gray.800" mb={2}>
                입금 계좌
              </Text>
              <Flex
                border="var(--border-main)"
                fontSize="13px"
                px={4}
                py={3}
                bg="gray.100"
                borderRadius="8px"
              >
                <Box mr={2}>{ACCOUNT_TEXT}</Box>
                <CopyBtn text={ACCOUNT_TEXT} />
              </Flex>

              <Box my={5}>
                <InfoList items={INFO_ARR} isLight />
              </Box>
              <TextCheckButton
                text={`${point.toLocaleString()}원 입금을 완료하셨나요?`}
                isChecked={isChecked}
                toggleCheck={() => setIsChecked((old) => !old)}
              />
            </Flex>
          </Box>
        </>
      </Slide>
      <BottomNav onClick={handleSubmit} text="완 료" isLoading={isLoading1 || isLoading2} />
    </>
  );
}
const INFO_ARR = [
  "완료 즉시 포인트가 충전됩니다.",
  "입금 전에 '충전' 버튼을 누르면 불이익을 받을 수 있습니다. ",
];

export default Charge;
