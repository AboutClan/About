import mongoose, { Model, Schema } from "mongoose";

import { IStoreApplicant } from "../types/models/store";

const giftSchema: Schema = new Schema(
  {
    uid: { type: String, ref: "User" },
    name: { type: String, ref: "User" },
    cnt: { type: Number, default: 0 },
    giftId: { type: Number },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.createdAt;
        delete ret.upadtedAt;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const GiftModel =
  (mongoose.models.GiftModel as Model<IStoreApplicant, {}, {}, {}>) ||
  mongoose.model<IStoreApplicant>("GiftModel", giftSchema);
