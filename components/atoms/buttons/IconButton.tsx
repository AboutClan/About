import { Button } from "@chakra-ui/react";

interface IIconButton {
  onClick?: () => void;
  children: React.ReactNode;
}
export default function IconButton({ children, onClick }: IIconButton) {
  return (
    <Button
      w="32px"
      h="32px"
      display="flex"
      justifyContent="center"
      alignContent="center"
      variant="unstyled"
      position="relative"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
