import mongoose, { model, Model, Schema } from "mongoose";
import {
  IAbsence,
  IAttendance,
  IParticipation,
  IVote,
} from "../types2/study/studyDetail";
import { IDayjsStartToEnd } from "../types2/timeAndDate";

const ParticipantTimeSchema: Schema<IDayjsStartToEnd> = new Schema(
  {
    start: {
      type: Date,
      required: false,
    },
    end: {
      type: Date,
      required: false,
    },
  },
  { _id: false }
);

const AttendenceSchema: Schema<IAttendance> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    time: ParticipantTimeSchema,

    arrived: Date,

    firstChoice: {
      type: Schema.Types.Boolean,
      default: true,
    },
    memo: String,
  },
  { _id: false, timestamps: true, strict: false }
);

const AbsenceSchema: Schema<IAbsence> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    noShow: {
      type: Schema.Types.Boolean,
      default: false,
    },
    message: Schema.Types.String,
  },
  { _id: false, timestamps: true }
);

const ParticipationSchema: Schema<IParticipation> = new Schema(
  {
    place: {
      type: Schema.Types.ObjectId,
      ref: "Place",
    },

    attendences: [AttendenceSchema],
    absences: [AbsenceSchema],
    startTime: Date,
    endTime: Date,

    status: {
      type: Schema.Types.String,
      enum: ["pending", "waiting_confirm", "open", "dismissed"],
      default: "pending",
    },
  },
  { _id: false }
);

const VoteSchema: Schema<IVote> = new Schema({
  date: Date,
  participations: [ParticipationSchema],
});

export const Vote =
  (mongoose.models.Vote as Model<IVote, {}, {}, {}>) ||
  model<IVote>("Vote", VoteSchema);
