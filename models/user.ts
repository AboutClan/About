/* eslint-disable */

import mongoose, { Model, model, Schema } from "mongoose";

import { AvatarProps, IRest, IUser } from "../types/models/userTypes/userInfoTypes";

export const restSchema: Schema<IRest> = new Schema({
  type: Schema.Types.String,
  startDate: Schema.Types.Date,
  endDate: Schema.Types.Date,
  content: Schema.Types.String,
});

export const avatarSchema: Schema<AvatarProps> = new Schema({
  type: {
    type: Schema.Types.Number,
    default: 1,
  },
  bg: {
    type: Schema.Types.Number,
    default: 1,
  },
});

export const UserSchema: Schema<IUser> = new Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  registerDate: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  birth: {
    type: String,
    default: "",
  },
  mbti: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: null,
  },

  profileImage: {
    type: String,
    default:
      "https://user-images.githubusercontent.com/48513798/173180642-8fc5948e-a437-45f3-91d0-3f0098a38195.png",
  },
  role: String,
  score: {
    type: Number,
    default: 0,
  },
  point: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    default: "안녕하세요! 잘 부탁드립니다~!",
  },
  rest: restSchema,

  avatar: avatarSchema,
  deposit: {
    type: Number,
    default: 2000,
  },
});

export const User =
  (mongoose.models.User as Model<IUser, {}, {}, {}>) || model<IUser>("User", UserSchema);
