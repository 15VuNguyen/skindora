import { PaymentMethod } from "./payment";
import { Voucher } from "./voucher";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Home: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Detail: undefined;
};

export type CartStackParamList = {
  Cart: {
    selectedVoucher?: Voucher | undefined;
    selectedPaymentMethod?: string | undefined;
  };
  Detail: {id: string | undefined};
  Checkout: undefined;
  VoucherApplication: {
    selectedVoucher?: Voucher | undefined;
    selectedPaymentMethod?: string | undefined;
  };
  PaymentMethod: {
    selectedVoucher?: Voucher | undefined;
    selectedPaymentMethod?: string | undefined;
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

export type NotificationStackParamList = {
  Notification: undefined;
  Detail: undefined;
};

export type SearchStackParamList = {
  Search: undefined;
  ProductList: undefined;
  Detail: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  NotificationTab: undefined;
  SearchTab: undefined;
  CartTab: undefined;
};
