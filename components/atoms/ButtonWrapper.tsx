import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";

interface ButtonWrapperProps {
  children: React.ReactNode;
  onClick?: () => void;
  url?: string;
  size?: "xs" | "sm" | "md";
  text?: string;
}

function ButtonWrapper({ text, children, onClick, url, size = "md" }: ButtonWrapperProps) {
  const width = size === "md" ? "44px" : size === "sm" ? "32px" : "28px";
  return (
    <>
      {url ? (
        <Link href={url}>
          <Button
            as="div"
            variant="unstyled"
            w={width}
            h={width}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box>{children}</Box>
          </Button>
        </Link>
      ) : (
        <Button
          as="div"
          variant="unstyled"
          w={!text ? width : undefined}
          h={width}
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={onClick}
        >
          <Flex align="center" h="16px">
            <Box fontWeight="400" lineHeight="16px">
              {text}
            </Box>
            <Box>{children}</Box>
          </Flex>
        </Button>
      )}
    </>
  );
}

export default ButtonWrapper;
