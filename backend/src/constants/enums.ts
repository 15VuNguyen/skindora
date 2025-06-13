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

export enum ProductState {
  INACTIVE = 'INACTIVE', //Sản phẩm không hoạt động
  ACTIVE = 'ACTIVE', //Sản phẩm đang hoạt động
  OUT_OF_STOCK = 'OUT_OF_STOCK', //Hết hàng
  DISCONTINUED = 'DISCONTINUED' //Ngừng kinh doanh
}

export enum FilterBrandState {
  //trạng thái cơ bản
  INACTIVE = 'INACTIVE', //Thương hiệu không hoạt động(chưa bắt đầu hoặc tạm thời không active)
  ACTIVE = 'ACTIVE', //Thương hiệu độc lập đang hoạt động

  //đối tác
  COLLABORATION = 'COLLABORATION', //Đang collab với brand khác
  PARTNERSHIP = 'PARTNERSHIP', //Quan hệ đối tác dài hạn

  //đặc biệt
  EXCLUSIVE = 'EXCLUSIVE', //Độc quyền phân phối
  LIMITED_EDITION = 'LIMITED_EDITION', //Phiên bản giới hạn collab

  //Inactive states
  SUSPENDED = 'SUSPENDED', //Tạm ngưng hoạt động do vi phạm policy hoặc vấn đề tạm thờiTạm ngưng hoạt động
  DISCONTINUED = 'DISCONTINUED' //Ngừng hợp tác/kinh doanh vĩnh viễn
}
