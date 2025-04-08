export interface IStoreGift {
  image: string;
  name: string;
  type?: "about" | "ticket" | null;
  brand: string;
  point: number;
  winner: number;
  giftId?: number;
  max?: number;
}

export interface IStoreApplicant {
  uid?: string | unknown;
  name: string;
  cnt: number;
  giftId?: number;
}

export interface IStoreQuery {
  users: IStoreApplicant[];
}
