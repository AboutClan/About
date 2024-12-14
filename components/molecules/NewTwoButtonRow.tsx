import { Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { JSXElementConstructor, ReactElement } from "react";

interface NewTwoButtonRowProps {
  leftProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: ReactElement<any, string | JSXElementConstructor<any>>;
    children?: React.ReactNode;
    url: string;
  };
  rightProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: ReactElement<any, string | JSXElementConstructor<any>>;
    children?: React.ReactNode;
    isDisabled?: boolean;
    func: () => void;
  };
}

function NewTwoButtonRow({ leftProps, rightProps }: NewTwoButtonRowProps) {
  return (
    <Flex>
      <Button
        as={Link}
        size="lg"
        href={leftProps.url}
        flex={1}
        h="48px"
        bgColor="white"
        borderRadius="12px"
        boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
        border="1px solid var(--gray-100)"
        leftIcon={leftProps?.icon}
        mr={2}
      >
        {leftProps.children}
      </Button>

      <Button
        flex={1}
        size="lg"
        h="48px"
        colorScheme="mint"
        borderRadius="12px"
        boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
        leftIcon={rightProps?.icon}
        isDisabled={rightProps?.isDisabled}
        onClick={rightProps.func}
      >
        {rightProps.children}
      </Button>
    </Flex>
  );
}

export default NewTwoButtonRow;
