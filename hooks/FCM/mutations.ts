import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";

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
