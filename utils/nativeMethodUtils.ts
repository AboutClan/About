import { NATIVE_CUSTOM_EVENTS } from "../constants/nativeCustomEvent";

export const NATIVE_METHODS = {
  HAPTIC: () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: NATIVE_CUSTOM_EVENTS.HAPTIC,
      }),
    );
  },
  VIBRATE: () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: NATIVE_CUSTOM_EVENTS.VIBRATE,
      }),
    );
  },
  OPEN_EXTERNAL_LINK: (link: string) => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        link,
        type: NATIVE_CUSTOM_EVENTS.OPEN_EXTERNAL_LINK,
      }),
    );
  },
  SHARE: (link: string) => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        link,
        type: NATIVE_CUSTOM_EVENTS.SHARE,
      }),
    );
  },
  SEND_TEXT_MESSAGE: (number: number) => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        number,
        type: NATIVE_CUSTOM_EVENTS.SEND_TEXT_MESSAGE,
      }),
    );
  },
  CALL_PHONE: (number: number) => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        number,
        type: NATIVE_CUSTOM_EVENTS.CALL_PHONE,
      }),
    );
  },
  KAKAO_LOGIN: () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: NATIVE_CUSTOM_EVENTS.KAKAO_LOGIN,
      }),
    );
  },
  APPLE_LOGIN: () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: NATIVE_CUSTOM_EVENTS.APPLE_LOGIN,
      }),
    );
  },
  GET_DEVICE_INFO: () => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: NATIVE_CUSTOM_EVENTS.GET_DEVICE_INFO,
      }),
    );
  },
};
