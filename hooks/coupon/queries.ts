import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { ICouponIssueResponse, ICouponResponse } from "../../types/models/couponTypes";

const COUPON = "coupon";

// 전체 쿠폰 리스트
export const useCouponListQuery = (options?: QueryOptions<ICouponResponse[]>) =>
  useQuery<ICouponResponse[], AxiosError>(
    [COUPON, "all"],
    async () => {
      const res = await axios.get<ICouponResponse[]>(`${SERVER_URI}/coupon`);
      return res.data;
    },
    options,
  );

// 쿠폰 정보 조회 (잔여 수량 포함)
export const useCouponQuery = (couponId: string, options?: QueryOptions<ICouponResponse>) =>
  useQuery<ICouponResponse, AxiosError>(
    [COUPON, couponId],
    async () => {
      const res = await axios.get<ICouponResponse>(`${SERVER_URI}/coupon/${couponId}`);
      return res.data;
    },
    { enabled: !!couponId, ...options },
  );

// name으로 쿠폰 정보 조회
export const useCouponByNameQuery = (name: string, options?: QueryOptions<ICouponResponse>) =>
  useQuery<ICouponResponse, AxiosError>(
    [COUPON, "name", name],
    async () => {
      const res = await axios.get<ICouponResponse>(
        `${SERVER_URI}/coupon/name/${encodeURIComponent(name)}`,
      );
      return res.data;
    },
    { enabled: !!name, ...options },
  );

// 내가 발급받은 쿠폰 조회
export const useCouponMineQuery = (
  couponId: string,
  options?: QueryOptions<ICouponIssueResponse>,
) =>
  useQuery<ICouponIssueResponse, AxiosError>(
    [COUPON, "mine", couponId],
    async () => {
      const res = await axios.get<ICouponIssueResponse>(`${SERVER_URI}/coupon/mine`, {
        params: { couponId },
      });
      return res.data;
    },
    { enabled: !!couponId, ...options },
  );
