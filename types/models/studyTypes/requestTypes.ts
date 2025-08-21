import { DayjsTimeProps, StringTimeProps } from "../../utils/timeAndDate";
import { PlaceInfoProps } from "../utilTypes";
import { StudyStatus } from "./study-entity.types";

export interface StudyAttendanceProps {
  time: string;
  memo: string;
  type: "arrived" | "absenced";
  attendanceImage?: string;
}

export interface RealTimeVoteProps {
  place: PlaceInfoProps;
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
  place?: PlaceInfoProps;
  arrivedMessage: string;
  status: StudyStatus;
  time: StringTimeProps;
}

// export interface RealTimeDirectAttendanceProps
//   extends RealTimeAttendanceProps,
//     RealTimeVoteProps {}
