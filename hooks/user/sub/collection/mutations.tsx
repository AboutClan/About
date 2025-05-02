import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

import { COLLECTION_ALPHABET } from "../../../../constants/keys/queryKeys";
import { SERVER_URI } from "../../../../constants/system";
import { requestServer } from "../../../../libs/methodHelpers";
import { MutationOptions } from "../../../../types/hooks/reactTypes";
import { Alphabet } from "../../../../types/models/collections";
import { useResetQueryData } from "../../../custom/CustomHooks";

export const useAlphabetStampMutation = (options?: MutationOptions<void, string>) => {
  const queryClient = useQueryClient();
  return useMutation<string, AxiosError, void>(
    async () =>
      requestServer<void, string>({
        method: "patch",
        url: `collection/alphabet`,
      }),
    {
      ...options,
      onSuccess() {
        queryClient.invalidateQueries([COLLECTION_ALPHABET]);
      },
    },
  );
};
type CollectionAlphabetParam<T> = T extends "get"
  ? { alphabet: Alphabet }
  : { mine: Alphabet; opponent: Alphabet; myId: string; toUid: string };

export const useAlphabetMutation = <T extends "get" | "change">(
  type: T,
  options?: MutationOptions<CollectionAlphabetParam<T>>,
) => {
  const resetQueryData = useResetQueryData();
  return useMutation<void, AxiosError, CollectionAlphabetParam<T>>(
    async (param) =>
      requestServer<CollectionAlphabetParam<T>>({
        method: "patch",
        url: `collection/alphabet${type === "change" ? "/change" : ""}`,
        body: param,
      }),
    {
      ...options,
      onSuccess() {
        resetQueryData([COLLECTION_ALPHABET]);
      },
    },
  );
};
export const useA = (options?: MutationOptions<void>) => {
  return useMutation<void, AxiosError, void>(
    async () =>
      requestServer<void>({
        method: "patch",
        url: `user/deposit/reset`,
        body: null,
      }),
    options,
  );
};

export const useAlphabetCompletedMutation = (options?: MutationOptions<void>) => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, void>(async () => {
    const res = await axios.post(`${SERVER_URI}/collection/alphabet/completed`);
    const data = res.data;
    if (data) {
      queryClient.invalidateQueries(COLLECTION_ALPHABET);
    }
    return data;
  }, options);
};
