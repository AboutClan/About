import { LocationProps } from "../../common";
import { DayjsTimeProps, StringTimeProps } from "../../utils/timeAndDate";
import { StudyStatus } from "./study-entity.types";

export interface StudyAttendanceProps {
  time: string;
  memo: string;
  type: "arrived" | "absenced";
  attendanceImage?: string;
}

export interface RealTimeVoteProps {
  place: LocationProps;
  time: DayjsTimeProps;
  status: StudyStatus;
}

export interface RealTimeAttendanceProps {
  memo: string;
  image: string | Blob;
  status: StudyStatus;
}

export interface RealTimesDirectAttendanceProps {
  image?: Blob;
  place?: LocationProps;
  arrivedMessage: string;
  status: StudyStatus;
  time: StringTimeProps;
}

// export interface RealTimeDirectAttendanceProps
//   extends RealTimeAttendanceProps,
//     RealTimeVoteProps {}
