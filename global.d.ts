import { Mongoose } from "mongoose";

export declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
  /* eslint-disable no-var */
  var mongoose: {
    conn?: Mongoose;
    promise?: Promise<Mongoose>;
  };
  /* eslint-disable no-var */
  var _mongoClientPromise: Promise<MongoClient>;
}
