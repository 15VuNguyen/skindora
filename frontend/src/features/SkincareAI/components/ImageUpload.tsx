import { Upload } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageUpload: (base64DataUrl: string) => void;
  onImageRemove: () => void;
}

const ImageUpload = ({ onImageUpload, onImageRemove }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessImage(file);
    }
  };

  const validateAndProcessImage = (file: File) => {
    if (!file.type.match("image.*")) {
      toast.error("Vui lòng tải lên tệp hình ảnh (JPEG, PNG, GIF, v.v.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh phải nhỏ hơn 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64DataUrl = reader.result as string;
      setPreview(base64DataUrl);
      onImageUpload(base64DataUrl);
      toast.success("Tải ảnh lên thành công!");
    };
    reader.onerror = () => {
      toast.error("Không thể đọc tệp hình ảnh.");
      setPreview(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessImage(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageRemove();
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="animate-fade-in mx-auto w-full max-w-md">
      {!preview ? (
        <div
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? "border-skin-blue bg-blue-50" : "hover:border-skin-blue border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="text-skin-blue mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-medium">Tải lên ảnh của bạn</h3>
          <p className="mb-4 text-sm text-gray-500">Kéo và thả hoặc nhấn để chọn (Tối đa 5MB)</p>
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif, image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Chọn ảnh
            </Button>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="Face preview" className="h-auto w-full rounded-lg shadow-md" />
          <Button
            className="absolute top-2 right-2 rounded-full bg-white p-2 text-gray-700 shadow-md hover:bg-gray-200"
            onClick={handleRemoveImage}
            size="icon"
            variant="outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
