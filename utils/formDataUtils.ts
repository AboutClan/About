import { RealTimeAttendanceProps } from "../types/models/studyTypes/baseTypes";
import { WritingFormProps } from "../types/services/writingTypes";

export const appendFormData = <T extends keyof WritingFormProps>(
  formData: FormData,
  key: T,
  value: WritingFormProps[T],
) => {
  formData.append(key, value);
};

export const appendRealTimeStudyFormData = <T extends keyof RealTimeAttendanceProps>(
  formData: FormData,
  key: T,
  value: RealTimeAttendanceProps[T],
) => {
  formData.append(key, value);
};
