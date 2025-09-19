export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerificationToken
}

export enum Role {
  User,
  Staff,
  Admin
}

export enum OrderStatus {
  PENDING = 'PENDING', // Đơn hàng vừa được tạo, chờ xác nhận
  CONFIRMED = 'CONFIRMED', // Đã xác nhận đơn hàng
  PROCESSING = 'PROCESSING', // Đang xử lý/kho đang chuẩn bị hàng
  SHIPPING = 'SHIPPING', // Đang giao hàng
  DELIVERED = 'DELIVERED', // Đã giao thành công
  CANCELLED = 'CANCELLED', // Bị hủy bởi người dùng/hệ thống
  RETURNED = 'RETURNED', // Đã hoàn trả hàng
  FAILED = 'FAILED' // Giao hàng thất bại (shipper không giao được)
}

export enum OrderType {
  CART = 'cart',
  BUY_NOW = 'buy-now'
}

export enum PaymentMethod {
  COD = 'COD',
  ZALOPAY = 'ZALOPAY',
  VNPAY = 'VNPAY'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID'
}

export enum CancelRequestStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum RefundStatus {
  NONE = 'NONE',
  REQUESTED = 'REQUESTED',
  PROCESSING = 'PROCESSING',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED'
}

export enum ProductState {
  INACTIVE = 'INACTIVE', //Sản phẩm không hoạt động
  ACTIVE = 'ACTIVE', //Sản phẩm đang hoạt động
  OUT_OF_STOCK = 'OUT_OF_STOCK', //Hết hàng
  DISCONTINUED = 'DISCONTINUED' //Ngừng kinh doanh
}

export enum GenericFilterState {
  INACTIVE = 'INACTIVE', // Filter không được áp dụng hoặc bị ẩn
  ACTIVE = 'ACTIVE' // Filter đang hoạt động và có thể sử dụng
}

export enum FilterBrandState {
  //trạng thái cơ bản
  INACTIVE = 'INACTIVE', //0 - //Thương hiệu không hoạt động(chưa bắt đầu hoặc tạm thời không active)
  ACTIVE = 'ACTIVE', //1 - //Thương hiệu độc lập đang hoạt động

  //đối tác
  COLLABORATION = 'COLLABORATION', //2 - //Đang collab với brand khác
  PARTNERSHIP = 'PARTNERSHIP', //3 - //Quan hệ đối tác dài hạn

  //đặc biệt
  EXCLUSIVE = 'EXCLUSIVE', //4 - //Độc quyền phân phối
  LIMITED_EDITION = 'LIMITED_EDITION', //5 - //Phiên bản giới hạn collab

  //Inactive states
  SUSPENDED = 'SUSPENDED', //6 - //Tạm ngưng hoạt động do vi phạm policy hoặc vấn đề tạm thờiTạm ngưng hoạt động
  DISCONTINUED = 'DISCONTINUED' //7 - //Ngừng hợp tác/kinh doanh vĩnh viễn
}

export enum DiscountType {
  Percentage = 'PERCENTAGE', // giảm giá theo %
  Fixed = 'FIXED' // giảm giá số tiền ví dụ giảm thẳng 50k
}

export enum BlogState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}