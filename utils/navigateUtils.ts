import { isWebView } from "@/utils/appEnvUtils";
import { nativeMethodUtils } from "@/utils/nativeMethodUtils";

export const navigateExternalLink = (url: string) => {
  if (isWebView()) {
    nativeMethodUtils.openExternalLink(url);
  } else {
    window.open(url, "_blank");
  }
};
