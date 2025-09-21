import { useState } from "react";
import { toast } from "sonner";

import { deletePost } from "@/api/post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Post } from "@/types/post";

export const DeletePostDialog = ({ post, children }: { post: Post; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      toast.success("Đã xóa bài viết thành công");
      setIsOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa bài viết");
      console.error("Error deleting post:", error);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Xác nhận xóa bài viết</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-600">
            Bạn có chắc chắn muốn xóa bài viết <strong>"{post.title}"</strong>?<br />
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center space-x-2 sm:space-x-0">
          <AlertDialogCancel className="mt-0">Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
            Xóa bài viết
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
