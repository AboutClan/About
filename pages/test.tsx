import { Button } from "@chakra-ui/react";
import { useEffect } from "react";

import { useToast } from "../hooks/custom/CustomToast";
import { isWebView } from "../utils/appEnvUtils";
import { navigateExternalLink } from "../utils/navigateUtils";

function Test() {
  const toast = useToast();
  useEffect(() => {
    if (isWebView()) {
      toast("info", "원활한 가입 기능 동작을 위해 웹사이트로 전환합니다.");
      setTimeout(() => {
        navigateExternalLink("https://study-about.club/register/access");
      }, 2000);
    }
  }, []);
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
