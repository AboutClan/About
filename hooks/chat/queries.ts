import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { ChatProps, MyChatsProps } from "../../types/models/chat";
import { IUser } from "../../types/models/userTypes/userInfoTypes";

export const useChatQuery = (
  toUid: string,
  options?: QueryOptions<{ opponent: IUser; contents: ChatProps[] }>,
) =>
  useQuery<{ opponent: IUser; contents: ChatProps[] }, AxiosError>(
    ["chat", toUid],
    async () => {
      const res = await axios.get<{ opponent: IUser; contents: ChatProps[] }>(
        `${SERVER_URI}/chat`,
        {
          params: { toUid },
        },
      );
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
