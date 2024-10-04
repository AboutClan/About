import { Button } from "@chakra-ui/react";

interface CurrentLocationBtnProps {
  onClick: () => void;
}

function CurrentLocationBtn({ onClick }: CurrentLocationBtnProps) {
  return (
    <Button
      rounded="full"
      bgColor="white"
      boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
      w="32px"
      size="sm"
      h="32px"
      p="0"
      border="1px solid var(--gray-100)"
      onClick={onClick}
    >
      <i className="fa-regular fa-location-crosshairs" />
    </Button>
  );
}

export default CurrentLocationBtn;
