export interface Review {
  _id: string;
  userID: string;
  productID: string;
  orderID: string;
  rating: number;
  comment: string;
  images: string[];
  videos: string[];
  createdAt: string;
  modifiedAt: string;
  isDeleted: boolean;
}