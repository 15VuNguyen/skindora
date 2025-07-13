
export function StoreFooter() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Về Skindora Shop</h3>
            <p className="text-gray-600">
              Cung cấp các sản phẩm dược mỹ phẩm chất lượng cao, 
              chính hãng với giá cả hợp lý nhất thị trường.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <p className="text-gray-600 mb-2">Hotline: 1800-6789</p>
            <p className="text-gray-600 mb-2">Email: contact@dmpshop.vn</p>
            <p className="text-gray-600">
              Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP.HCM
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Chính sách</h3>
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
        <div className="border-t mt-8 pt-6 text-center text-gray-600">
          <p>© 2025 Skindora Shop. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
