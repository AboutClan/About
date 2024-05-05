import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { MutationOptions } from "../../types/hooks/reactTypes";

export const useImageUploadMutation = (options?: MutationOptions<FormData>) =>
  useMutation<void, AxiosError, FormData>(async (imageForm: FormData) => {
    const res = await axios.post(`${SERVER_URI}/image/upload`, imageForm, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }, options);
