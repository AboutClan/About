import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { UseMutationOptions, UseQueryOptions } from "react-query";

export type DispatchType<T> = Dispatch<SetStateAction<T>>;

export type DispatchBoolean = Dispatch<SetStateAction<boolean>>;
export type DispatchNumber = Dispatch<SetStateAction<number>>;
export type DispatchString = Dispatch<SetStateAction<string>>;

export interface IRefetch {
  setIsRefetch: React.Dispatch<SetStateAction<boolean>>;
}

export type QueryOptions<TData = unknown> = Omit<
  UseQueryOptions<TData, AxiosError, TData>,
  "queryKey" | "queryFn"
>;

export type MutationOptions<TData = unknown, TReturnType = void> = Omit<
  UseMutationOptions<TReturnType, AxiosError, TData>,
  "mutationKey" | "mutationFn"
>;
