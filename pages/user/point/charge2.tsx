import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQueryClient } from "react-query";

import CountNum from "../../../components/atoms/CountNum";
import InfoList from "../../../components/atoms/lists/InfoList";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ValueBoxCol, { ValueBoxColItemProps } from "../../../components/molecules/ValueBoxCol";
import { USER_INFO } from "../../../constants/keys/queryKeys";
import { useToast } from "../../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";

export const ACCOUNT_TEXT = "우리은행 1002364221277 (어바웃)";

function Charge() {
  const router = useRouter();
  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();

  const [point, setPoint] = useState(5000);

  const queryClient = useQueryClient();
  const { mutate: updatePoint, isLoading: isLoading1 } = usePointSystemMutation("point", {
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      toast("success", "충전이 완료되었습니다.");
    },
  });
  console.log(updatePoint);
  // const { mutate, isLoading: isLoading2 } = useUserRequestMutation({
  //   onSuccess() {
  //     router.push("/user");
  //   },
  // });

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
    router.push({
      pathname: "/payment/join-fee",
      query: {
        uid: userInfo.uid,
        amount: 20000,
        source: "access",
      },
    });
    // if (!isChecked) {
    //   toast("warning", "입금 여부를 체크해 주세요!");
    //   return;
    // }
    // updatePoint({ value: point, message: "포인트 충전", sub: "charge" });

    // mutate({
    //   category: "충전",
    //   title: "포인트 충전",
    //   content: dayjsToFormat(dayjs(), "M월 D일 H시 m분") + "/" + point.toLocaleString() + "원",
    // });
  };

  return (
    <>
      <Header title="" />
      <Slide>
        <Box h="54px" />
        <RegisterOverview>
          <>
            <span>포인트 충전</span>
            <span>About 활동에 필요한 포인트를 충전할 수 있습니다</span>
          </>
        </RegisterOverview>

        <>
          <Box mt={5} mb={20}>
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
              <Box mt={5} w="full">
                <ValueBoxCol items={valueBoxColItems} />{" "}
              </Box>
              <Box fontSize="10px" ml="auto" mt={2} color="gray.500">
                * 포인트는 결제일로부터 1년간 유효합니다.
              </Box>

              <Box mt={10} ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                ⚠️ 유의사항 ⚠️
              </Box>
              <Box>
                <InfoList items={INFO_ARR} isLight />
              </Box>
            </Flex>
          </Box>
        </>
      </Slide>
      <BottomNav onClick={handleSubmit} text="포인트 충전하기" isLoading={isLoading1} />
    </>
  );
}
const INFO_ARR = [
  "포인트는 모임 참여 및 상품 교환에 사용할 수 있습니다.",
  "포인트는 서비스 내의 이용 재화로, 환불되지 않습니다.",
];

export default Charge;
