import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions, QueryOptions } from "../../types/hooks/reactTypes";

interface NotificationMessageProps {
  title: string;
  body: string;
}

interface SendNotificationProps {
  token: string;
  message: {
    notification: NotificationMessageProps;
  };
}

export const useSendNotificationAllMutation = (
  type: "all" | "study",
  options?: MutationOptions<{ title: string; description: string }>,
) =>
  useMutation<void, AxiosError, { title: string; description: string }>(
    (params) =>
      requestServer<{ title: string; description: string }>({
        method: "post",
        url: `fcm/sendNotification/${type}`,
        body: params,
      }),
    options,
  );

export const useSendNotificationMutation = (options?: MutationOptions<SendNotificationProps>) =>
  useMutation<void, AxiosError, SendNotificationProps>(
    (params) =>
      requestServer<SendNotificationProps>({
        method: "delete",
        url: "fcm/send-notification",
        body: params,
      }),
    options,
  );
export const useSendTestMutation = (options?: MutationOptions<SendNotificationProps>) =>
  useMutation<void, AxiosError, SendNotificationProps>(
    (params) =>
      requestServer<SendNotificationProps>({
        method: "delete",
        url: "fcm/send-notification",
        body: params,
      }),
    options,
  );

export const useSendFCMTestQuery = (options?: QueryOptions<void>) =>
  useQuery<void, AxiosError>(
    ["FCMTest"],
    async () => {
      const res = await axios.get<void>(`${SERVER_URI}/fcm/test`, {});
      return res.data;
    },
    options,
  );
