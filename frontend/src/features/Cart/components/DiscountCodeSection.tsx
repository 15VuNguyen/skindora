// import { Tag, X, LoaderCircle } from "lucide-react";
// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { useApplyVoucherMutation } from "@/hooks/mutations/useApplyVoucherMutation";
// import { useClearVoucherMutation } from "@/hooks/mutations/useClearVoucherMutation"; // We will create this small utility mutation

// interface DiscountCodeSectionProps {
//   appliedDiscount?: {
//     code: string;
//     amount: number;
//   };
// }

// export function DiscountCodeSection({ appliedDiscount }: DiscountCodeSectionProps) {
//   const [discountCode, setDiscountCode] = useState("");
  
//   const { mutate: applyVoucher, isPending: isApplying } = useApplyVoucherMutation();
//   const { mutate: clearVoucher, isPending: isClearing } = useClearVoucherMutation();

//   const handleApplyCode = () => {
//     if (!discountCode.trim()) {
//       return;
//     }
//     applyVoucher(discountCode);
//   };

//   const handleRemoveDiscount = () => {
//     clearVoucher();
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleApplyCode();
//     }
//   };

//   return (
//     <Card>
//       <CardContent className="p-4">
//         <div className="mb-3 flex items-center gap-2">
//           <Tag className="h-4 w-4 text-gray-600" />
//           <span className="font-medium">Mã giảm giá</span>
//         </div>

//         {appliedDiscount && appliedDiscount.code ? (
//           <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
//             <div className="flex items-center gap-2">
//               <Badge variant="secondary" className="bg-green-100 text-green-800">
//                 {appliedDiscount.code}
//               </Badge>
//               <span className="text-sm font-medium text-green-700">
//                 - {appliedDiscount.amount.toLocaleString("vi-VN")}₫
//               </span>
//             </div>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-6 w-6"
//               onClick={handleRemoveDiscount}
//               disabled={isClearing}
//             >
//               {isClearing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-2">
//             <div className="flex gap-2">
//               <Input
//                 placeholder="Nhập mã giảm giá"
//                 value={discountCode}
//                 onChange={(e) => setDiscountCode(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="flex-1"
//                 disabled={isApplying}
//               />
//               <Button
//                 variant="outline"
//                 onClick={handleApplyCode}
//                 disabled={isApplying || !discountCode.trim()}
//               >
//                 {isApplying ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Áp dụng"}
//               </Button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }