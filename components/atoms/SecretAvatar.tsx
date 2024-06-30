import { Box } from "@chakra-ui/react";

import { useTypeToast } from "../../hooks/custom/CustomToast";
import Avatar from "./Avatar";

function SecretAvatar() {
  const typeToast = useTypeToast();

  const onClick = () => {
    typeToast("secret-avatar");
  };

  return (
    <Box onClick={onClick}>
      <Avatar image="" avatar={{ type: 0, bg: 9 }} size="md" isLink={false} />
    </Box>
  );
}

export default SecretAvatar;
