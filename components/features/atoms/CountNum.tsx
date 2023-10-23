import { faMinus, faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { DispatchNumber } from "../../../types/reactTypes";

interface ICountNum {
  value: number;
  setValue: DispatchNumber;
  unit?: "명";
  min?: number;
  isSmall?: boolean;
}

function CountNum({ value, setValue, unit, min = 1, isSmall }: ICountNum) {
  return (
    <Layout isSmall={isSmall}>
      <IconWrapper
        isMinus={true}
        isVisible={value > min}
        disabled={value <= min}
        isSmall={isSmall}
        onClick={() => setValue((old) => old - 1)}
      >
        <FontAwesomeIcon icon={faMinus} size="sm" />
      </IconWrapper>
      <Count>
        {value}
        {unit}
      </Count>
      <IconWrapper
        isMinus={false}
        isVisible={true}
        isSmall={isSmall}
        onClick={() => setValue((old) => old + 1)}
      >
        <FontAwesomeIcon icon={faPlus} size="sm" />
      </IconWrapper>
    </Layout>
  );
}

const Layout = styled.div<{ isSmall: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${(props) => (props.isSmall ? "14px" : "20px")};
`;

const IconWrapper = styled.button<{
  isMinus: boolean;
  isVisible: boolean;
  isSmall: boolean;
}>`
  color: ${(props) => (props.isVisible ? "var(--font-h1)" : "var(--font-h6)")};
  padding: 0 var(--padding-min);
  margin-right: ${(props) =>
    props.isMinus
      ? props.isSmall
        ? "var(--margin-md)"
        : "var(--margin-main)"
      : 0};
  margin-left: ${(props) =>
    !props.isMinus
      ? props.isSmall
        ? "var(--margin-md)"
        : "var(--margin-main)"
      : 0};
  cursor: pointer;
`;

const Count = styled.span``;

export default CountNum;
