export interface CancelRequest {
  _id: string;
  UserID: string;
  ShipAddress: string;
  RequireDate: string;
  PaymentMethod: string;
  PaymentStatus: string;
  TotalPrice: string;
  Status: string;
  created_at: string;
  updated_at: string;
  CancelRequest: CancelRequestProps;
  RefundStatus: string;
}
export interface CancelRequestProps {
  approvedAt: string;
  reason: string;
  requestedAt: string;
  staffId: string;
  staffNote: string;
  status: string;
}
