import { Mongoose } from "mongoose";

export declare global {
  /* eslint-disable no-var */
  var mongoose: {
    conn?: Mongoose;
    promise?: Promise<Mongoose>;
  };
  /* eslint-disable no-var */
  var _mongoClientPromise: Promise<MongoClient>;
}
