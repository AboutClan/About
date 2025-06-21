import { isWebView } from "./appEnvUtils";
import { nativeMethodUtils } from "./nativeMethodUtils";

export const navigateExternalLink = (url:string) => {
      if (isWebView()) {
        nativeMethodUtils.openExternalLink(url);
      } else {
        window.open(url, "_blank");
      }
}