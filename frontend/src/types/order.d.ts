export interface Order {
  _id: string;
  UserID: string;
  ShipAddress: string;
  Description: string;
  RequireDate: string;
  Status: string;
}
// src/types/order.ts

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  username: string;
  phone_number: string;
  avatar: string;
}

export interface CancelRequest {
  status: string; // Changed from enum to string as requested
  reason: string;
  requestedAt: string; // ISO 8601 Date String
  staffId: string;
  approvedAt?: string; // ISO 8601 Date String, optional
  staffNote?: string; // Optional field
}

export interface ProductInOrderDetail {
  productId: string;
  name: string;
  image: string;
  price: string; // Stored as string
}

export interface OrderDetailItem {
  _id: string;
  Quantity: string; // Stored as string
  OrderDate: string; // ISO 8601 Date String
  UnitPrice: string; // Stored as string
  Products: ProductInOrderDetail;
}

export interface Order {
  _id: string;
  User: User;
  ShipAddress: string;
  Description: string;
  RequireDate: string; // ISO 8601 Date String
  PaymentMethod: string; // Changed from enum to string as requested
  PaymentStatus: string; // Changed from enum to string as requested
  Status: string; // Changed from enum to string as requested
  TotalPrice: string; // Stored as string
  created_at: string; // ISO 8601 Date String
  updated_at: string; // ISO 8601 Date String
  CancelRequest?: CancelRequest; // Optional
  updatedAt: string; // ISO 8601 Date String
}

// This interface represents the 'result' object directly returned by your API response.
export interface OrderAPIResult {
  order: Order;
  orderDetail: OrderDetailItem[];
}

// And if you want to type the *entire* API response:
export interface ApiResponse {
  message: string;
  result: OrderAPIResult;
}
