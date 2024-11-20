import { Box } from "@chakra-ui/react";
import styled from "styled-components";

import { useToast } from "../../hooks/custom/CustomToast";
import { DispatchNumber } from "../../types/hooks/reactTypes";

interface ICountNum {
  value: number;
  setValue: DispatchNumber;
  unit?: "명";
  min?: number;
  isSmall?: boolean;
  maxValue?: number;
}

function CountNum({ value, setValue, unit, min = 1, isSmall, maxValue }: ICountNum) {
  const toast = useToast();

  const onClickUpValue = () => {
    if (value >= maxValue) {
      toast("warning", "최대 개수입니다.");
      return;
    }
    setValue((old) => old + 1);
  };

  return (
    <Layout isSmall={isSmall}>
      <IconWrapper
        isMinus={true}
        isVisible={value > min}
        disabled={value <= min}
        isSmall={isSmall}
        onClick={() => setValue((old) => old - 1)}
      >
        <i className="fa-regular fa-minus fa-sm" />
      </IconWrapper>
      <Box as="span" fontSize={isSmall ? "14px" : "20px"} mx={1}>
        {value}
        {unit}
      </Box>
      <IconWrapper isMinus={false} isVisible={true} isSmall={isSmall} onClick={onClickUpValue}>
        <i className="fa-regular fa-plus fa-sm" />
      </IconWrapper>
    </Layout>
  );
}

const Layout = styled.div<{ isSmall: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${(props) => (props.isSmall ? "14px" : "18px")};
`;

const IconWrapper = styled.button<{
  isMinus: boolean;
  isVisible: boolean;
  isSmall: boolean;
}>`
  color: ${(props) => (props.isVisible ? "var(--gray-800)" : "var(--gray-300)")};
  padding: 0 var(--gap-1);
  margin-right: ${(props) =>
    props.isMinus ? (props.isSmall ? "var(--gap-2)" : "var(--gap-4)") : 0};
  margin-left: ${(props) =>
    !props.isMinus ? (props.isSmall ? "var(--gap-2)" : "var(--gap-4)") : 0};
  cursor: pointer;
`;

export default CountNum;
