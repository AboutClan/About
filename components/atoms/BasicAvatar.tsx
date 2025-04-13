import { Box } from "@chakra-ui/react";

import Avatar from "./Avatar";

function BasicAvatar() {
  const onClick = () => {
    // typeToast("secret-avatar");
  };

  return (
    <Box onClick={onClick}>
      <Avatar image="" avatar={{ type: 0, bg: 9 }} size="md" isLink={false} />
    </Box>
  );
}

export default BasicAvatar;
