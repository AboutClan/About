import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { ICouponIssueResponse, ICouponResponse } from "../../types/models/couponTypes";

interface RegisterCouponProps {
  partnerId: string;
  code: string;
  quantity: number;
  name?: string;
}

interface RegisterCouponBulkProps {
  partnerId: string;
  codes: string[];
  name?: string;
}

interface IssueCouponProps {
  couponId: string;
}

interface IssueCouponByPartnerProps {
  partnerId: string;
}

// 제휴처 쿠폰 등록 → couponId + remainingCount 반환
export const useCouponRegisterMutation = (
  options?: MutationOptions<RegisterCouponProps, ICouponResponse>,
) =>
  useMutation<ICouponResponse, AxiosError, RegisterCouponProps>(
    (param) =>
      requestServer<RegisterCouponProps, ICouponResponse>({
        method: "post",
        url: `coupon`,
        body: param,
      }),
    options,
  );

// 쿠폰 코드 일괄 등록 (코드별 1회 사용 쿠폰으로 등록)
export const useCouponBulkRegisterMutation = (
  options?: MutationOptions<RegisterCouponBulkProps, ICouponResponse[]>,
) =>
  useMutation<ICouponResponse[], AxiosError, RegisterCouponBulkProps>(
    (param) =>
      requestServer<RegisterCouponBulkProps, ICouponResponse[]>({
        method: "post",
        url: `coupon/bulk`,
        body: param,
      }),
    options,
  );

// 사용자 쿠폰 발급 (동일 couponId 1회만)
export const useCouponIssueMutation = (
  options?: MutationOptions<IssueCouponProps, ICouponIssueResponse>,
) =>
  useMutation<ICouponIssueResponse, AxiosError, IssueCouponProps>(
    (param) =>
      requestServer<IssueCouponProps, ICouponIssueResponse>({
        method: "post",
        url: `coupon/issue`,
        body: param,
      }),
    options,
  );

// partnerId로 쿠폰 발급 (이미 발급받은 기록이 있으면 그대로, 없으면 잔여 코드 중 신규 배정)
export const useCouponIssueByPartnerMutation = (
  options?: MutationOptions<IssueCouponByPartnerProps, ICouponIssueResponse>,
) =>
  useMutation<ICouponIssueResponse, AxiosError, IssueCouponByPartnerProps>(
    (param) =>
      requestServer<IssueCouponByPartnerProps, ICouponIssueResponse>({
        method: "post",
        url: `coupon/issue-by-partner`,
        body: param,
      }),
    options,
  );
