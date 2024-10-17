import { Button } from "@chakra-ui/react";

interface HighlightButtonProps {
  text: string;
  func: () => void;
}

function HighlightButton({ text, func }: HighlightButtonProps) {
  return (
    <Button
      bg="white"
      w="100%"
      size="md"
      border="1px solid var(--color-mint)"
      onClick={func}
      borderRadius="8px"
      color="mint"
      fontWeight="semibold"
    >
      {text}
    </Button>
  );
}

export default HighlightButton;
