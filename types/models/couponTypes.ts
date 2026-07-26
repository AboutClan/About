export interface ICouponResponse {
  couponId: string;
  partnerId: string;
  code: string;
  name?: string;
  totalCount: number;
  remainingCount: number;
}

export interface ICouponIssueResponse {
  couponId: string;
  userId: string;
  issuedAt: string;
  code?: string;
}
