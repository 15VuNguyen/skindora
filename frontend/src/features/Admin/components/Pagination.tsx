import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// 1. Định nghĩa kiểu cho props
interface PaginationDemoProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// 2. Nhận props vào component
export function PaginationDemo({ totalPages, currentPage, onPageChange }: PaginationDemoProps) {
  // Nếu không có trang nào thì không hiển thị gì cả
  if (totalPages <= 1) {
    return null;
  }

  // Logic để tạo ra danh sách các trang sẽ hiển thị
  // Ví dụ: luôn hiển thị trang 1, trang cuối, và các trang xung quanh trang hiện tại
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số lượng trang tối đa hiển thị cùng lúc
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    // Luôn thêm trang đầu tiên
    if (totalPages > 1) {
      pageNumbers.push(1);
    }

    // Thêm dấu "..." nếu cần
    if (currentPage > halfPagesToShow + 2) {
      pageNumbers.push("...");
    }

    // Tính toán trang bắt đầu và kết thúc để hiển thị
    let startPage = Math.max(2, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);

    if (currentPage <= halfPagesToShow + 1) {
      endPage = Math.min(totalPages - 1, maxPagesToShow);
    }

    if (currentPage >= totalPages - halfPagesToShow) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 1);
    }

    // Thêm các trang vào mảng
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Thêm dấu "..." nếu cần
    if (currentPage < totalPages - halfPagesToShow - 1) {
      pageNumbers.push("...");
    }

    // Luôn thêm trang cuối cùng
    pageNumbers.push(totalPages);

    // Loại bỏ các phần tử trùng lặp (ví dụ: nếu totalPages < maxPagesToShow)
    return [...new Set(pageNumbers)];
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {/* Nút Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            // Vô hiệu hóa nếu đang ở trang đầu
            style={{
              pointerEvents: currentPage === 1 ? "none" : "auto",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          />
        </PaginationItem>

        {/* Các trang */}
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === "number" ? (
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        {/* Nút Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            // Vô hiệu hóa nếu đang ở trang cuối
            style={{
              pointerEvents: currentPage === totalPages ? "none" : "auto",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
