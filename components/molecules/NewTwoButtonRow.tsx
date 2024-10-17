import { Button, Flex } from "@chakra-ui/react";
import { JSXElementConstructor, ReactElement } from "react";

interface NewTwoButtonRowProps {
  leftProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: ReactElement<any, string | JSXElementConstructor<any>>;
    children?: React.ReactNode;
  };
  rightProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: ReactElement<any, string | JSXElementConstructor<any>>;
    children?: React.ReactNode;
    isDisabled?: boolean;
  };
}

function NewTwoButtonRow({ leftProps, rightProps }: NewTwoButtonRowProps) {
  return (
    <Flex>
      <Button
        as="div"
        flex={1}
        mr={3}
        size="lg"
        h="48px"
        bgColor="white"
        borderRadius="12px"
        boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
        border="1px solid var(--gray-100)"
        leftIcon={leftProps?.icon}
      >
        {leftProps.children}
      </Button>
      <Button
        as="div"
        flex={1}
        size="lg"
        h="48px"
        colorScheme="mintTheme"
        borderRadius="12px"
        boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
        leftIcon={rightProps?.icon}
        isDisabled={rightProps?.isDisabled}
      >
        {rightProps.children}
      </Button>
    </Flex>
  );
}

export default NewTwoButtonRow;
