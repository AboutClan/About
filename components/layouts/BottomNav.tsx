import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Slide from "./PageSlide";

interface IBottomNav {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (e?: any) => void;
  text?: string;
  url?: string;
}

function BottomNav({ onClick, text, url }: IBottomNav) {
  const searchParams = useSearchParams();
  const params = searchParams.toString();

  function BottomButton() {
    return (
      <Button
        position="fixed"
        left="50%"
        bottom="0"
        maxW="var(--view-max-width)"
        transform="translate(-50%,0)"
        width="calc(100% - 2*var(--gap-4))"
        size="lg"
        mb="var(--gap-4)"
        borderRadius="var(--rounded)"
        backgroundColor="var(--color-mint)"
        color="white"
        fontSize="15px"
        onClick={onClick}
        _focus={{ backgroundColor: "var(--color-mint)", color: "white" }}
      >
        {text || "다음"}
      </Button>
    );
  }

  return (
    <Slide isFixed={true} posZero="top">
      {url ? (
        <Link href={url + (params ? `?${params}` : "")}>
          <BottomButton />
        </Link>
      ) : (
        <BottomButton />
      )}
    </Slide>
  );
}

export default BottomNav;
