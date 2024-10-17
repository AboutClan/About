import { Button } from "@chakra-ui/react";
import Link from "next/link";

interface SectionFooterButtonProps {
  text?: string;
  url: string;
}

function SectionFooterButton({ text = "전체보기", url }: SectionFooterButtonProps) {
  return (
    <Link href={url}>
      <Button w="100%" h="40px" bgColor="white" border="0.5px solid #E8E8E8">
        {text}
      </Button>
    </Link>
  );
}

export default SectionFooterButton;
