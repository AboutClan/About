import { Box, Button, Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import Script from "next/script";
import { useState } from "react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ValueBoxCol, { ValueBoxColItemProps } from "../../../components/molecules/ValueBoxCol";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import RegisterPaymentButton from "../../../pageTemplates/register/access/RegisterPaymentButton";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";

const JQ_SRC = "https://code.jquery.com/jquery-1.12.4.min.js";

function Charge() {
  const { data: userInfo } = useUserInfoQuery();

  const [chargePoint, setChargePoint] = useState(3000);

  const valueBoxColItems: ValueBoxColItemProps[] = [
    {
      left: "보유 포인트",
      right: userInfo?.point?.toLocaleString() + " Point",
    },
    {
      left: `충전 포인트`,
      right: chargePoint?.toLocaleString() + " Point",
    },

    {
      left: "최종 포인트",
      right: (userInfo?.point + chargePoint)?.toLocaleString() + " Point",
      isFinal: true,
    },
  ];

  const pointArr = [3000, 5000, 10000];

  return (
    <>
      <Script src={JQ_SRC} strategy="afterInteractive" />
      <Header title="" />
      <Slide>
        <Box h="54px" />
        <RegisterOverview>
          <>
            <span>포인트 충전</span>
            <span>포인트는 어바웃 서비스 전반에서 사용되는 재화입니다.</span>
          </>
        </RegisterOverview>

        <>
          <Box mt={5} mb={20} minH="70dvh">
            <Flex direction="column">
              <Flex>
                {pointArr.map((point, idx) => (
                  <Button
                    key={idx}
                    mr={2}
                    borderRadius="8px"
                    size="lg"
                    colorScheme={chargePoint === point ? "mint" : "gray"}
                    onClick={() => {
                      setChargePoint(point);
                    }}
                  >
                    {point.toLocaleString()} Point
                  </Button>
                ))}
              </Flex>
              <Box mx="auto" mt={3} fontSize="12px" fontWeight={600} color="mint">
                1,000 Point = 1,000원
              </Box>
              <Box mt={8} w="full">
                <ValueBoxCol items={valueBoxColItems} />{" "}
                <UnorderedList fontSize="12px" color="gray.500" mt="10px" ml={0}>
                  <ListItem textAlign="start">
                    포인트는 디지털 서비스 재화로 환불되지 않습니다.
                  </ListItem>
                </UnorderedList>
              </Box>
            </Flex>
          </Box>
        </>
      </Slide>
      <RegisterPaymentButton type="point" value={chargePoint} />
    </>
  );
}

export default Charge;
