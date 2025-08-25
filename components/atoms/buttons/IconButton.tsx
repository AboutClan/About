import { Button } from "@chakra-ui/react";

interface IIconButton {
  onClick?: () => void;
  children: React.ReactNode;
  isDisabled?: boolean;
}
export default function IconButton({ children, onClick, isDisabled }: IIconButton) {
  return (
    <Button
      w="32px"
      h="32px"
      display="flex"
      justifyContent="center"
      alignContent="center"
      variant="unstyled"
      position="relative"
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
