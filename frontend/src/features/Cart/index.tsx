import { LoaderCircle, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { CartItemCard } from "./components/CartItemCard";
import { CartSummary } from "./components/CartSummary";
import { VoucherDialog } from "./components/VoucherDialog";
import { useCartPageLogic } from "./hooks/useCartPageLogic";

const CartPage = () => {
  const {
    navigate,
    isCartLoading,
    isError,
    handleCheckout,
    isPreparingOrder,
    error,
    handleApplyManualVoucher,
    cartItems,
    isAllSelected,
    isClearing,
    mutatingItemId,
    isVoucherDialogOpen,
    subtotal,
    total,
    discountAmount,
    appliedVoucher,
    selectedItems,
    selectedItemIds,
    handleSelectAll,
    handleSelectItem,
    handleRemoveItem,
    handleUpdateQuantity,
    handleApplyVoucher,
    clearVoucher,
    clearCart,
    setIsVoucherDialogOpen,
  } = useCartPageLogic();

  if (isCartLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <LoaderCircle className="text-primary mb-4 h-16 w-16 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900">Đang tải giỏ hàng...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-destructive mb-2 text-2xl font-bold">Không thể tải giỏ hàng</h2>
        <p className="mb-6 max-w-md text-gray-500">{error?.message}</p>
        <Button onClick={() => navigate("/products")}>Mua sắm ngay</Button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-400" />
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h2>
        <p className="mb-6 max-w-md text-center text-gray-500">Có vẻ như bạn chưa thêm sản phẩm nào.</p>
        <Button onClick={() => navigate("/products")}>Tiếp tục mua sắm</Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-4 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">
              TRANG CHỦ
            </Link>
            <span className="mx-2">›</span>
            <span>GIỎ HÀNG</span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between rounded-t-lg border-b bg-white p-4">
                <h1 className="text-xl font-bold">
                  GIỎ HÀNG <span className="font-normal text-gray-600">({cartItems.length} sản phẩm)</span>
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={handleSelectAll} />
                    <label htmlFor="select-all" className="cursor-pointer text-sm font-medium">
                      Chọn tất cả
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearCart()}
                    disabled={isClearing}
                    className="text-gray-500 hover:text-white"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Xóa
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.ProductID}
                    item={item}
                    isSelected={selectedItemIds.includes(item.ProductID)}
                    isMutating={mutatingItemId === item.ProductID}
                    onSelectItem={handleSelectItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <CartSummary
                  onApplyManualVoucher={handleApplyManualVoucher}
                  subtotal={subtotal}
                  isProcessingCheckout={isPreparingOrder}
                  onCheckout={handleCheckout}
                  total={total}
                  discount={appliedVoucher ? { code: appliedVoucher.code, amount: discountAmount } : undefined}
                  selectedItems={selectedItems}
                  onOpenVoucherDialog={() => setIsVoucherDialogOpen(true)}
                  onClearVoucher={appliedVoucher ? clearVoucher : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoucherDialog
        isOpen={isVoucherDialogOpen}
        onOpenChange={setIsVoucherDialogOpen}
        onApplyVoucher={handleApplyVoucher}
        selectedVoucherCode={appliedVoucher?.code}
        subtotal={subtotal}
      />
    </>
  );
};

export default CartPage;
