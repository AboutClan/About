import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/apiConstants";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { ChatProps } from "../../types/models/chat";

export const useChatQuery = (toUid: string, options?: QueryOptions<ChatProps[]>) =>
  useQuery<ChatProps[], AxiosError>(
    ["chat", toUid],
    async () => {
      const res = await axios.get<ChatProps[]>(`${SERVER_URI}/chat`, {
        params: { toUid },
      });
      return res.data;
    },
    options,
  );
