import { WritingFormProps } from "../types/services/writingTypes";

export const appendFormData = <T extends keyof WritingFormProps>(
  formData: FormData,
  key: T,
  value: WritingFormProps[T],
) => {
  formData.append(key, value);
};
