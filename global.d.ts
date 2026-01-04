import { Mongoose } from "mongoose";

interface KakaoAuthParams {
  redirectUri?: string;
  nonce?: string;
  throughTalk: boolean;
  state?: string;
}

export declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    Kakao: {
      init: (keyValue: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (params: KakaoAuthParams) => void;
      };
      Link: {
        createDefaultButton: (options: unknown) => void;
      };
    };
    AppleID: {
      auth: {
        init: ({
          clientId: string,
          scope: string,
          redirectURI: string,
          state: string,
          usePopup: boolean,
          nonce: string,
        }) => void;
        signIn: () => void;
      };
    };
    AboutAppBridge?: {
      platform?: "ios" | "android" | "windows" | "macos" | "web";
    };
  }
  /* eslint-disable no-var */
  var mongoose: {
    conn?: Mongoose;
    promise?: Promise<Mongoose>;
  };
  /* eslint-disable no-var */
  var _mongoClientPromise: Promise<MongoClient>;
}
