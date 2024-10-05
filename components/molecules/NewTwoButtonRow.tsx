import { Flex } from "@chakra-ui/react";
import { JSXElementConstructor, ReactElement } from "react";
import NewButton from "../../components/atoms/NewButton";

interface NewTwoButtonRowProps {
  leftProps: {
    icon?: ReactElement<any, string | JSXElementConstructor<any>>;
    children?: React.ReactNode;
  };
  rightProps: {
    icon?: ReactElement<any, string | JSXElementConstructor<any>>;
    children?: React.ReactNode;
    isDisabled?: boolean;
  };
}

function NewTwoButtonRow({ leftProps, rightProps }: NewTwoButtonRowProps) {
  return (
    <Flex>
      <NewButton
        as="div"
        flex={1}
        fontWeight={700}
        mr={3}
        size="sm"
        h="48px"
        bgColor="white"
        borderRadius="12px"
        boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
        border="1px solid var(--gray-100)"
        leftIcon={leftProps?.icon}
      >
        {leftProps.children}
      </NewButton>
      <NewButton
        as="div"
        flex={1}
        fontWeight={700}
        size="sm"
        h="48px"
        colorScheme="mintTheme"
        borderRadius="12px"
        boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
        leftIcon={rightProps?.icon}
        isDisabled={rightProps?.isDisabled}
      >
        {rightProps.children}
      </NewButton>
    </Flex>
  );
}

export default NewTwoButtonRow;
