import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { CloseProps } from "../../types/components/modalTypes";
import InfoList from "../atoms/lists/InfoList";
import BottomNav from "../layouts/BottomNav";
import LabeledInput from "../molecules/LabeledInput";
import TabNav from "../molecules/navs/TabNav";
import TextCheckButton from "../molecules/TextCheckButton";
import ValueBoxCol, { ValueBoxColItemProps } from "../molecules/ValueBoxCol";
import RightDrawer from "../organisms/drawer/RightDrawer";

function PaymentConfirmationDrawer({ onClose }: CloseProps) {
  const toast = useToast();
  const typeToast = useTypeToast();
  const [tab, setTab] = useState<"Point로 지급" | "계좌로 지급">("Point로 지급");
  const [isChecked, setIsChecked] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [value4, setValue4] = useState("");

  const { mutate } = useUserRequestMutation({
    onSuccess() {
      typeToast("apply");
    },
  });

  const valueBoxColItems: ValueBoxColItemProps[] = [
    {
      left: "기본 지원금(후기)",
      right: "3,000 Point",
    },
    {
      left: `추가 지원금${tab === "계좌로 지급" ? "(10% 수수료)" : ""}`,
      right: tab === "Point로 지급" ? "2,000 - 20,000 Point" : "1,800원 - 18,000원",
    },
    {
      left: "총 금액",
      right: tab === "Point로 지급" ? "= 5,000 - 23,000 Point" : "= 4,800원 - 21,000원",
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
    if (tab === "계좌로 지급" && !value4) {
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
    <RightDrawer title="" onClose={onClose}>
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
      <>
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
                  text: "Point로 지급",
                  func: () => setTab("Point로 지급"),
                },
                { text: "계좌로 지급", func: () => setTab("계좌로 지급") },
              ]}
            />{" "}
            <Box mt={5}>
              <Flex direction="column">
                <ValueBoxCol items={valueBoxColItems} />
                <Box as="li" fontSize="12px" lineHeight="20px" mt="10px" color="gray.600">
                  운영진 확인 후 최대 일주일 이내에 지급됩니다.
                </Box>
                <Box my={5}>
                  <InfoList items={INFO_ARR} />
                </Box>
                {tab === "계좌로 지급" && (
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
                    tab === "Point로 지급"
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
        <BottomNav
          onClick={isFirstPage ? navigateNextPage : handleSubmit}
          isSlide={false}
          text={isFirstPage ? "다 음" : "완 료"}
        />
      </>
    </RightDrawer>
  );
}
const INFO_ARR = [
  "콘텐츠에 따라 최소 5,000원에서 최대 20,000원 지원합니다.",
  "3,000원은 후기 작성 Point로 즉시 지급됩니다.",
  "번개 서포터즈 인원은 20%를 추가 지원받습니다.",
];

export default PaymentConfirmationDrawer;
