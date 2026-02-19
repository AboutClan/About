/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useQueryClient } from "react-query";

import InfoList from "../../components/atoms/lists/InfoList";
import Slide from "../../components/layouts/PageSlide";
import Accordion from "../../components/molecules/Accordion";
import TextCheckButton from "../../components/molecules/TextCheckButton";
import ValueBoxCol2 from "../../components/molecules/ValueBoxCol2";
import { ACCORDION_CONTENT_FAQ } from "../../constants/contentsText/accordionContents";
import { useToast } from "../../hooks/custom/CustomToast";
import RegisterAccessHeader from "../../pageTemplates/register/access/RegisterAccessHeader";
import RegisterComparation from "../../pageTemplates/register/access/RegisterComparation";
import RegisterGatherCount from "../../pageTemplates/register/access/RegisterGatherCount";
import RegisterPaymentButton from "../../pageTemplates/register/access/RegisterPaymentButton";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import { VALUE_BOX_COL_ITEMS } from "./fee";

const JQ_SRC = "https://code.jquery.com/jquery-1.12.4.min.js";

function Access() {
  const { data: session } = useSession();

  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  // const [tab, setTab] = useState<"가입 안내" | "자주 묻는 질문">("가입 안내");
  // const [isChecked, setIsChecked] = useState(false);

  // const orderNo = useMemo(() => `ORD-${Date.now()}-${Math.random().toString(16).slice(2)}`, []);

  return (
    <>
      <Script src={JQ_SRC} strategy="afterInteractive" />
      <RegisterAccessHeader />
      <Slide isNoPadding>
        <RegisterGatherCount />
      </Slide>
      <Slide>
        <RegisterComparation />
      </Slide>

      <RegisterLayout>
        {/*         
        <RegisterOverview isNoTop>
          <span>최종 가입 안내</span>
          <span>결제 완료 후, 바로 동아리 활동을 시작할 수 있어요!</span>
        </RegisterOverview> */}
        {/* <TabNav
          isFullSize
          isBlack
          tabOptionsArr={[
            {
              text: "가입 안내",
              func: () => setTab("가입 안내"),
            },
            { text: "자주 묻는 질문", func: () => setTab("자주 묻는 질문") },
          ]}
        /> */}
        <Box mt={5}>
          {true ? (
            <Flex direction="column">
              <ValueBoxCol2 items={VALUE_BOX_COL_ITEMS} />

              <UnorderedList fontSize="12px" color="gray.600" mt="10px" ml={0}>
                <ListItem textAlign="start">
                  7일 이내 탈퇴 시, 이용 이력이 없으면 전액 환불! (포인트 제외)
                  {/* 7일 이내 탈퇴 및
                  미이용 시, 가입비는 전액 환불됩니다. (포인트 제외) */}
                </ListItem>
                {/* <ListItem textAlign="start">
                  포인트는 서비스 이용 재화로 환불되지 않습니다.
                </ListItem> */}
              </UnorderedList>

              <Flex flexDir="column" mt={8}>
                <Flex align="center" ml={0.5} fontSize="14px" mb={2} fontWeight="semibold">
                  ✅ 가입을 완료하면! ✅
                </Flex>

                <InfoList items={INFO_ARR2} />
              </Flex>

              <Box mt={5}>
                <TextCheckButton
                  text="위 내용을 모두 확인했습니다."
                  // isChecked={isChecked}
                  toggleCheck={() => setIsChecked((old) => !old)}
                />
              </Box>
            </Flex>
          ) : (
            <Accordion
              defaultIndex={0}
              contentArr={[
                ...ACCORDION_CONTENT_FAQ.slice(0, 2),
                {
                  title: "가입 완료 후에는 어떻게 하나요?",
                  content:
                    "회비 결제와 함께 동아리 가입이 완료됩니다. 가입 후 안내되는 [신규 인원 가이드]를 확인해 주세요!",
                },
              ]}
            />
          )}
        </Box>
      </RegisterLayout>
      <RegisterPaymentButton />
    </>
  );
}

const INFO_ARR2 = [
  "10,000명 이상의 멤버가 활동중인 어바웃 멤버가 돼요!",
  "공부·취미·친목 등 수백 개의 모임에 참여할 수 있어요!",
  "뉴비 멤버십이 적용되고, 다양한 혜택을 받을 수 있어요!",
];

export default Access;
