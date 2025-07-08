export type Voucher = {
  id: string;
  code: string;
  name: string;
  discountType: DiscountType;
  discountAmount: number;
  minTotalApplicable?: number;
  maxDiscountAmount?: number;
};

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}
