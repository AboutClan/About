import { LocationProps } from "../../common";
import { DayjsTimeProps, StringTimeProps } from "../../utils/timeAndDate";
import { RealTimesStudyStatus } from "./study-entity.types";

export interface StudyAttendanceProps {
  time: string;
  memo: string;
  type: "arrived" | "absenced";
  attendanceImage?: string;
}

export interface RealTimeVoteProps {
  place: LocationProps;
  time: DayjsTimeProps;
  status: RealTimesStudyStatus;
  uid?: string;
}

export interface RealTimeAttendanceProps {
  memo: string;
  image: string | Blob;
  status: RealTimesStudyStatus;
}

export interface RealTimesDirectAttendanceProps {
  image?: Blob;
  place?: LocationProps;
  arrivedMessage: string;
  status: RealTimesStudyStatus;
  time: StringTimeProps;
}

// export interface RealTimeDirectAttendanceProps
//   extends RealTimeAttendanceProps,
//     RealTimeVoteProps {}
