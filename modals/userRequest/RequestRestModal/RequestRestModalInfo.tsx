import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { PopOverIcon } from "../../../components/Icons/PopOverIcon";
import { ModalBody } from "../../Modals";
import { IApplyRest } from "./RequestRestModal";
const POPOVER_MESSAGE =
  "일반 휴식은 기본 분기별로 1회, 최대 한달까지만 가능합니다. 추가적으로 휴식 기간이 필요한 경우 보증금 500원 차감과 함께 신청됩니다. 특별 휴식은 기간에 상관없이 휴식이 가능하나, 인정될만한 특수한 사정이 있는 경우에만 관리자 동의하에 가능합니다.";

interface IRequestRestModalInfo {
  onSubmit: (data: IApplyRest) => void;
}

function RequestRestModalInfo({ onSubmit }: IRequestRestModalInfo) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IApplyRest>({
    defaultValues: {
      type: "일반",
      startDate: dayjs().format("YYYY-MM-DD"),
      endDate: "",
      content: "",
    },
  });
  const { data: session } = useSession();
  const option = watch("type");
  const startDate = watch("startDate");
  const getEndDateRange = (type: "min" | "max") => {
    if (option === "특별" || !startDate) return;
    const start = new Date(startDate as string);
    const min = start.toISOString().split("T")[0];
    const max = start.setMonth(start.getMonth() + 1);
    if (type === "min") return { value: min, message: "기간을 확인해주세요!" };
    if (type === "max")
      return {
        value: max,
        message: "일반 휴식은 최대 한달까지만 가능합니다! ",
      };
  };

  return (
    <ModalBody>
      <Form onSubmit={handleSubmit(onSubmit)} id="rest">
        <Item>
          <span>이름:</span>
          <span>{session?.user.name}</span>
        </Item>
        <Item>
          <span>타입:</span>
          <TypeSelect {...register("type")}>
            <option value="일반">일반 휴식</option>
            <option value="특별">특별 휴식</option>
          </TypeSelect>
          <PopOverIcon text={POPOVER_MESSAGE} />
        </Item>
        <DateItem>
          <span>기간:</span>
          <DateInput type="date" {...register("startDate")} />
          <DateInput
            type="date"
            {...register("endDate", {
              min: getEndDateRange("min"),
              max: getEndDateRange("max"),
            })}
          />
        </DateItem>
        <Item>
          <Reason>사유:</Reason>
          <Textarea {...register("content")}></Textarea>
        </Item>
      </Form>
      <ErrorMessage>{errors?.endDate?.message}</ErrorMessage>
    </ModalBody>
  );
}

const Form = styled.form`
  height: 100%;

  display: flex;

  flex-direction: column;

  > div:last-child {
    flex: 1;
  }
`;
const Item = styled.div`
  display: flex;
  margin-bottom: var(--gap-3);
  align-items: center;
  > span:first-child {
    width: 15%;
    font-weight: 600;
  }
  > input,
  select {
    padding: var(--gap-1);
  }
`;

const DateItem = styled(Item)`
  > input {
    flex: 0.5;
  }
  > input:nth-child(2) {
    margin-right: var(--gap-3);
  }
`;

const DateInput = styled.input`
  padding: var(--gap-1);
  background-color: var(--input-bg);
  border-radius: var(--rounded-lg);
`;

const ErrorMessage = styled.div`
  font-size: 11px;
  height: 16px;
  color: var(--color-red);
`;

const TypeSelect = styled.select`
  background-color: var(--input-bg);
  border-radius: var(--rounded-lg);
  margin-right: var(--gap-3);
`;

const Reason = styled.span`
  margin-bottom: auto;
`;

const Textarea = styled.textarea`
  padding: var(--gap-2);
  flex: 1;
  height: 100%;
  background-color: var(--gray-200);
  border-radius: var(--rounded-lg);
`;

export default RequestRestModalInfo;
