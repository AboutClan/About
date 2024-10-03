import { Button, ButtonProps } from "@chakra-ui/react";

function NewButton({ ...props }: ButtonProps) {
  return <Button {...props} />;
}

export default NewButton;
