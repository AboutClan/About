import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { requestServer } from "../../libs/methodHelpers";

export const usePatchPollMutation = ({ squareId }: { squareId: string }) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ user, pollItems }: { user: string; pollItems: string[] }) =>
      requestServer({
        method: "patch",
        url: `square/${squareId}/poll`,
        body: {
          user,
          pollItems,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["secretSquare", { squareId }],
        });
        queryClient.invalidateQueries({
          queryKey: ["secretSquare", "currentPollStatus", { squareId }],
        });
      },
    },
  );
};

export const usePostSecretSquareMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ formData }: { formData: FormData }) =>
      requestServer({
        method: "post",
        url: "square",
        body: formData,
      }),

    {
      onSuccess: (_, { formData }) => {
        const category = formData.get("category");
        queryClient.invalidateQueries({
          queryKey: ["secretSquare", { category }],
        });
      },
    },
  );
};
