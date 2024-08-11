import { useMutation, useQueryClient } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { SecretSquareCategory } from "../../types/models/square";

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

export const useCreateSecretSquareMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ formData }: { formData: FormData }) =>
      requestServer<FormData, { squareId: string }>({
        method: "post",
        url: "square",
        body: formData,
      }),
    {
      onSuccess: (_, { formData }) => {
        const category = formData.get("category");
        // HACK 전체 카테고리와 각 카테고리를 모두 invalidate 해야하는가? 개선의 여지가 있음
        queryClient.invalidateQueries({
          queryKey: ["secretSquare", { category: "전체" }],
        });
        queryClient.invalidateQueries({
          queryKey: ["secretSquare", { category }],
        });
      },
    },
  );
};

export const useDeleteSecretSquareMutation = ({ squareId }: { squareId: string }) => {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      requestServer({
        method: "delete",
        url: `square/${squareId}`,
      }),
    {
      onSuccess: (_, { category }: { category: SecretSquareCategory }) => {
        // HACK 전체 카테고리와 각 카테고리를 모두 invalidate 해야하는가? 개선의 여지가 있음
        queryClient.invalidateQueries({
          queryKey: ["secretSquare", { category: "전체" }],
        });
        queryClient.invalidateQueries({
          queryKey: ["secretSquare", { category }],
        });
      },
    },
  );
};

export const usePutLikeSecretSquareMutation = ({ squareId }: { squareId: string }) => {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      requestServer({
        method: "put",
        url: `square/${squareId}/like`,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["secretSquare", { squareId }] });
        queryClient.invalidateQueries({ queryKey: ["secretSquare", "isLike", { squareId }] });
      },
    },
  );
};

export const useDeleteLikeSecretSquareMutation = ({ squareId }: { squareId: string }) => {
  const queryClient = useQueryClient();

  return useMutation(
    () =>
      requestServer({
        method: "delete",
        url: `square/${squareId}/like`,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["secretSquare", { squareId }] });
        queryClient.invalidateQueries({ queryKey: ["secretSquare", "isLike", { squareId }] });
      },
    },
  );
};
