import { useCallback } from "react";
import { type SetterOrUpdater } from "recoil";

import { isWebView } from "../utils/appEnvUtils";
import { nativeMethodUtils } from "../utils/nativeMethodUtils";

type SlideDirectionType = string | null;

const useHandleMove = (setSlideDirection: SetterOrUpdater<SlideDirectionType>) => {
  const handleHapticFeedback = useCallback(() => {
    if (isWebView()) {
      nativeMethodUtils.haptic();
    }
  }, []);

  const handleMove = useCallback(() => {
    handleHapticFeedback();
    setSlideDirection(null);
  }, [handleHapticFeedback, setSlideDirection]);

  return handleMove;
};

export default useHandleMove;
