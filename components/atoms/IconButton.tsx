import { Button, ButtonProps } from "@chakra-ui/react";

interface IconButtonProps {
  props: ButtonProps;
}

function IconButton({ props }: IconButtonProps) {
  return <Button {...props} variant="unstyled" w={7} h={7} display="flex"></Button>;
}

export default IconButton;
