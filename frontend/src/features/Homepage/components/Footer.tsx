export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-300 bg-gray-50 py-8 text-gray-800 shadow">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Về DMP Shop</h3>
            <p className="text-gray-600">
              Cung cấp các sản phẩm dược mỹ phẩm chất lượng cao, chính hãng với giá cả hợp lý nhất thị trường.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên hệ</h3>
            <p className="mb-2 text-gray-600">Hotline: 1800-6789</p>
            <p className="mb-2 text-gray-600">Email: contact@dmpshop.vn</p>
            <p className="text-gray-600">Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP.HCM</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Chính sách</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-primary">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-gray-600">
          <p>© 2025 DMP Shop. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
