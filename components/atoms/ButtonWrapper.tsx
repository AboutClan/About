import { Button } from "@chakra-ui/react";
import Link from "next/link";

interface ButtonWrapperProps {
  children: React.ReactNode;
  onClick?: () => void;
  url?: string;
  size?: "sm" | "md";
}

function ButtonWrapper({ children, onClick, url, size = "md" }: ButtonWrapperProps) {
  const width = size === "md" ? 8 : 6;
  return (
    <>
      {url ? (
        <Link href={url}>
          <Button as="div" variant="unstyled" w={width} h={width} display="flex">
            {children}
          </Button>
        </Link>
      ) : (
        <Button onClick={onClick} variant="unstyled" w={width} h={width} display="flex">
          {children}
        </Button>
      )}
    </>
  );
}

export default ButtonWrapper;
