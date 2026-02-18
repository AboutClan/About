import { Button } from "@chakra-ui/react";

import { useToast } from "../hooks/custom/CustomToast";
import { navigateExternalLink } from "../utils/navigateUtils";

function Test() {
  const toast = useToast();
  
  return (
    <>
      <Button
        onClick={() => {
          toast("success", "성공");
          navigateExternalLink("https://study-about.club/register/access");
        }}
      >
        테스트
      </Button>
    </>
  );
}

export default Test;
