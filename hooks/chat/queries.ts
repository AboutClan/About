import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/apiConstants";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { ChatProps, MyChatsProps } from "../../types/models/chat";

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

export const useMyChatsQuery = (options?: QueryOptions<MyChatsProps[]>) =>
  useQuery<MyChatsProps[], AxiosError>(
    ["chatMine"],
    async () => {
      const res = await axios.get<MyChatsProps[]>(`${SERVER_URI}/chat/mine`);
      return res.data;
    },
    options,
  );

export const useRecentChatQuery = (options?: QueryOptions<string>) =>
  useQuery<string, AxiosError>(
    ["recentChat"],
    async () => {
      const res = await axios.get<string>(`${SERVER_URI}/chat/recent`);
      return res.data;
    },
    options,
  );
