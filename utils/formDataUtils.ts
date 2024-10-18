import { RealTimeBasicAttendanceProps } from "../types/models/studyTypes/studyDetails";
import { WritingFormProps } from "../types/services/writingTypes";

export const appendFormData = <T extends keyof WritingFormProps>(
  formData: FormData,
  key: T,
  value: WritingFormProps[T],
) => {
  formData.append(key, value);
};

export const appendRealTimeStudyFormData = <T extends keyof RealTimeBasicAttendanceProps>(
  formData: FormData,
  key: T,
  value: RealTimeBasicAttendanceProps[T],
) => {
  formData.append(key, value);
};
