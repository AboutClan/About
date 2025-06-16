import { Box, Flex, ListItem, UnorderedList } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

// import "react-date-range/dist/styles.css"; // main css file
// import "react-date-range/dist/theme/default.css"; // theme css file
import { Input } from "../../../components/atoms/Input";
import Select from "../../../components/atoms/Select";
import Textarea from "../../../components/atoms/Textarea";
import { PopOverIcon } from "../../../components/Icons/PopOverIcon";
import { useFailToast, useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../../hooks/user/mutations";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { IUserRequest } from "../../../types/models/userTypes/userRequestTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";

export interface IApplyRest {
  type: "일반" | "특별" | string;
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  content: string;
}

function RequestRestModal({ setIsModal }: IModal) {
  const toast = useToast();
  const failToast = useFailToast();

  const [value, setValue] = useState<"일반 휴식" | "특별 휴식">("일반 휴식");
  const [date, setDate] = useState("");
  const [text, setText] = useState("");

  const { mutate: sendRestRequest } = useUserRequestMutation();

  const { mutate: setRest } = useUserInfoFieldMutation("rest", {
    onSuccess() {
      setIsModal(false);
      toast("success", "신청 완료");
    },
    onError(err) {
      console.error(err);
      failToast("error");
    },
  });

  const handleSubmit = () => {
    if (!date || !text) {
      toast("error", "누락된 항목이 있습니다.");
      return;
    }
    if (dayjs(date).isBefore(dayjs())) {
      toast("error", "날짜를 확인해 주세요.");
      return;
    }
    if (value === "일반 휴식" && dayjs(date).diff(dayjs(), "d") > 31) {
      toast("error", "일반 휴식은 최대 한 달까지만 가능합니다.");
      return;
    }

    const restInfo = {
      type: value === "일반 휴식" ? "일반" : "특별",
      startDate: dayjs().toString(),
      endDate: dayjs(date).toString(),
      content: text,
    };

    if (value === "특별 휴식") {
      const requestData: IUserRequest = {
        category: "휴식",
        content: dayjs(date).format("YYYY-MM-DD") + " / " + text,
      };
      sendRestRequest(requestData);
    }

    setRest({ info: restInfo });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "신청",
      func: handleSubmit,
    },
    sub: {
      text: "취소",
    },
  };

  return (
    <ModalLayout title="휴식 신청" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box>
        <Flex align="center" mb={2}>
          <Box mr={2}>유형:</Box>
          <Flex>
            <Select
              defaultValue={value}
              options={["일반 휴식", "특별 휴식"]}
              setValue={setValue}
              size="sm"
            />
            <PopOverIcon text="일반 휴식은 해당 달만 가능합니다. 특별 휴식은 기간이 상관없으나, 사유가 명확해야 승인됩니다." />
          </Flex>
        </Flex>
        <Flex align="center" lineHeight="20px">
          <Box mr={2}>기간:</Box>
          <Box>
            <Input
              type="date"
              size="sm"
              fontSize="11px"
              borderRadius="8px"
              h="28px"
              px={2}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Box>
        </Flex>
        <Flex lineHeight="20px" mt={2} mb={5}>
          <Box mr={2}>사유:</Box>
          <Box flex={1}>
            <Textarea
              size="sm"
              fontSize="11px"
              borderRadius="8px"
              h="28px"
              px={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Box>
        </Flex>

        <UnorderedList textAlign="start" ml={0} fontSize="12px">
          <ListItem>휴식 신청은 매월 1일부터 10일까지 가능합니다.</ListItem>
          <ListItem>휴식 기간 동안은 월간 패널티가 면제됩니다.</ListItem>
          <ListItem>휴식 기간 동안은 모든 활동이 제한됩니다.</ListItem>
        </UnorderedList>
      </Box>
    </ModalLayout>
  );
}

export default RequestRestModal;
