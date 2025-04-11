import { DayjsTimeProps, StringTimeProps } from "../../utils/timeAndDate";
import { PlaceInfoProps } from "../utilTypes";
import { RealTimesStatus } from "./baseTypes";

export interface StudyAttendanceProps {
  time: string;
  memo: string;
  type: "arrived" | "absenced";
  attendanceImage?: string;
}

export interface RealTimeVoteProps {
  place: PlaceInfoProps;
  time: DayjsTimeProps;
}

export interface RealTimeAttendanceProps {
  memo: string;
  image: string | Blob;
  status: RealTimesStatus;
}

export interface RealTimesDirectAttendanceProps {
  image?: Blob;
  place?: PlaceInfoProps;
  arrivedMessage: string;
  status: RealTimesStatus;
  time: StringTimeProps;
}

// export interface RealTimeDirectAttendanceProps
//   extends RealTimeAttendanceProps,
//     RealTimeVoteProps {}
