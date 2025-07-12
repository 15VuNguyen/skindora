export interface Voucher {
  _id: string;
  code: string;
  description: string;
  discountValue: string;
  discountType: string;
  maxDiscountAmount: string;
  minOrderValue: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  usedCount: string;
  userUsageLimit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
