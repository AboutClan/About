import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { iPhoneNotchSize } from "../../utils/validationUtils";
import Slide from "./PageSlide";

interface IBottomNav {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (e?: any) => void;
  text?: string;
  url?: string;
  isSlide?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
  isExternalLink?: boolean;
}

function BottomNav({
  onClick,
  text,
  url,
  isSlide = true,
  isLoading,
  isActive = true,
  isExternalLink,
}: IBottomNav) {
  const searchParams = useSearchParams();
  const params = searchParams.toString();

  function BottomButton() {
    return (
      <Button
        position="fixed"
        left="50%"
        bottom={`calc(8px + ${iPhoneNotchSize()}px)`}
        maxW="var(--view-max-width)"
        transform="translate(-50%,0)"
        width="calc(100% - 2*var(--gap-4))"
        size="lg"
        borderRadius="12px"
        backgroundColor={isActive ? "var(--color-mint)" : "gray.400"}
        color="white"
        fontSize="14px"
        isLoading={isLoading}
        fontWeight={700}
        onClick={onClick}
        _focus={{ backgroundColor: "var(--color-mint)", color: "white" }}
        isDisabled={!isActive}
        opacity={!isActive && "1 !important"}
      >
        {text || "다 음"}
      </Button>
    );
  }

  return (
    <>
      {isSlide ? (
        <Slide isFixed={true} posZero="top">
          {url ? (
            <Link href={url + (params ? `?${params}` : "")}>
              <BottomButton />
            </Link>
          ) : (
            <BottomButton />
          )}
        </Slide>
      ) : (
        <>
          {url ? (
            isExternalLink ? (
              <a
                href={url + (params ? `?${params}` : "")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BottomButton />
              </a>
            ) : (
              <Link href={url + (params ? `?${params}` : "")}>
                <BottomButton />
              </Link>
            )
          ) : (
            <BottomButton />
          )}
        </>
      )}
    </>
  );
}

export default BottomNav;
