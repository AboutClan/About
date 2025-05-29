import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import InfoList from "../../../components/atoms/lists/InfoList";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import LabeledInput from "../../../components/molecules/LabeledInput";
import TabNav from "../../../components/molecules/navs/TabNav";
import TextCheckButton from "../../../components/molecules/TextCheckButton";
import ValueBoxCol, { ValueBoxColItemProps } from "../../../components/molecules/ValueBoxCol";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";

function Settlement() {
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();
  const [tab, setTab] = useState<"포인트로 지급" | "계좌이체로 지급">("포인트로 지급");
  const [isChecked, setIsChecked] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [value4, setValue4] = useState("");

  const { mutate } = useUserRequestMutation({
    onSuccess() {
      typeToast("apply");
      router.push("/user");
    },
  });

  const valueBoxColItems: ValueBoxColItemProps[] = [
    {
      left: "기본 지원금(4명 기준)",
      right: tab === "포인트로 지급" ? "+5,000 Point" : "+4,500원",
    },
    {
      left: `추가 인원 지원금`,
      right: tab === "포인트로 지급" ? "인 당 +1,000 Point" : "인 당 +900원",
    },
    {
      left: `콘텐츠 추가 지원금`,
      right: tab === "포인트로 지급" ? "최대 15,000 Point" : "최대 13,500원",
    },
    {
      left: "총 금액",
      right: tab === "포인트로 지급" ? "= 5,000 - 30,000 Point" : "= 4,500 - 27,000원",
      isFinal: true,
    },
  ];

  useEffect(() => {
    setIsChecked(false);
  }, [tab]);

  const navigateNextPage = () => {
    if (!value1 || !value2) {
      toast("warning", "내용을 확인해 주세요");
      return;
    }
    setIsFirstPage(false);
  };

  const handleSubmit = () => {
    if (!isChecked) {
      toast("warning", "최종 확인을 체크해 주세요.");
      return;
    }
    if (tab === "계좌이체로 지급" && !value4) {
      toast("warning", "계좌번호를 입력해 주세요.");
      return;
    }
    mutate({
      category: "지원금",
      title: "번개 모임 지원금",
      content: `${value1} / ${value2} / ${value3} / ${value4}`,
    });
  };
  return (
    <>
      <Header title="정산 받기" />
      <Slide>
        <Box h="54px" />
        <RegisterOverview>
          {isFirstPage ? (
            <>
              <span>활동 지원금 신청</span>
              <span>지원받고자 하는 활동의 내용을 입력해 주세요</span>
            </>
          ) : (
            <>
              <span>활동 지원금 신청</span>
              <span>지원받고자 하는 재화 유형을 선택해 주세요</span>
            </>
          )}
        </RegisterOverview>

        {isFirstPage ? (
          <Box fontSize="12px">
            <Box mb={4}>
              <LabeledInput
                label="활동 내용"
                placeholder="ex) 을지로 맛집 탐방"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <LabeledInput
                label="최종 참여 인원"
                placeholder="ex) 6명"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
              />
            </Box>
            <Box mb={4}>
              <LabeledInput
                label="특이사항(선택)"
                placeholder="ex) 노쇼 인원, 비매너 인원 등"
                value={value3}
                onChange={(e) => setValue3(e.target.value)}
              />
            </Box>
          </Box>
        ) : (
          <>
            <TabNav
              isFullSize
              isBlack
              tabOptionsArr={[
                {
                  text: "포인트로 지급",
                  func: () => setTab("포인트로 지급"),
                },
                { text: "계좌이체로 지급", func: () => setTab("계좌이체로 지급") },
              ]}
            />{" "}
            <Box mt={5}>
              <Flex direction="column">
                <ValueBoxCol items={valueBoxColItems} />
                <Box as="li" fontSize="12px" lineHeight="20px" mt="10px" color="gray.600">
                  번개 모임 지원금은 후기가 업로드되어 있어야 합니다.
                </Box>
                <Box my={5}>
                  <InfoList items={INFO_ARR} />
                </Box>
                {tab === "계좌이체로 지급" && (
                  <Box mb={4}>
                    <LabeledInput
                      label="계좌 번호"
                      placeholder="ex) 000-00-0000 (기업)"
                      value={value4}
                      onChange={(e) => setValue4(e.target.value)}
                    />
                  </Box>
                )}
                <TextCheckButton
                  text={
                    tab === "포인트로 지급"
                      ? "지원금을 Point로 받으시겠어요?"
                      : "지원금을 계좌로 입금 받으시겠어요?"
                  }
                  isChecked={isChecked}
                  toggleCheck={() => setIsChecked((old) => !old)}
                />
              </Flex>
            </Box>
          </>
        )}
      </Slide>
      <BottomNav
        onClick={isFirstPage ? navigateNextPage : handleSubmit}
        text={isFirstPage ? "다 음" : "완 료"}
      />
    </>
  );
}
const INFO_ARR = [
  "최대 일주일 이내에 요청하신 수단으로 지급됩니다.",
  "현금 수령시 10%의 수수료가 차감됩니다.",
  "번개 서포터즈는 10%를 추가 지원받습니다.",
];

export default Settlement;
