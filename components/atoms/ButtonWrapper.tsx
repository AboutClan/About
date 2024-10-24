import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";

interface ButtonWrapperProps {
  children: React.ReactNode;
  onClick?: () => void;
  url?: string;
  size?: "xs" | "sm" | "md";
}

function ButtonWrapper({ children, onClick, url, size = "md" }: ButtonWrapperProps) {
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
          w={width}
          h={width}
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={onClick}
        >
          <Box>{children}</Box>
        </Button>
      )}
    </>
  );
}

export default ButtonWrapper;
