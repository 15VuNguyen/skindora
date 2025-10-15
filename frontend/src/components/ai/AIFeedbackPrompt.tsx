import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AIFeedbackPromptProps {
  label?: string;
  helperText?: string;
  isSubmitting?: boolean;
  hasSubmitted?: boolean;
  currentRating?: number;
  currentComment?: string;
  submitLabel?: string;
  onSubmit: (rating: number, comment?: string) => void;
}

const DEFAULT_LABEL = "Bạn thấy gợi ý này thế nào?";
const DEFAULT_HELPER = "Đánh giá & chia sẻ nhanh để Skindora cải thiện trải nghiệm dành riêng cho bạn.";

export const AIFeedbackPrompt = ({
  label = DEFAULT_LABEL,
  helperText = DEFAULT_HELPER,
  isSubmitting = false,
  hasSubmitted = false,
  currentRating = 0,
  currentComment = "",
  submitLabel = "Gửi đánh giá",
  onSubmit,
}: AIFeedbackPromptProps) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(currentRating);
  const [comment, setComment] = useState<string>(currentComment);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    setSelectedRating(currentRating);
  }, [currentRating]);

  useEffect(() => {
    setComment(currentComment);
  }, [currentComment]);

  const displayRating = useMemo(
    () => (hoveredStar !== null ? hoveredStar : selectedRating),
    [hoveredStar, selectedRating]
  );

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    if (selectedRating === 0 || isSubmitting) {
      return;
    }

    onSubmit(selectedRating, comment.trim() ? comment.trim() : undefined);
  };

  const validationMessage = selectedRating === 0 && hasAttemptedSubmit ? "Vui lòng chọn số sao đánh giá" : undefined;

  if (hasSubmitted) {
    return (
      <div className="mt-2 rounded-lg border border-emerald-100 bg-emerald-50/80 p-3 text-xs text-emerald-700 shadow-sm">
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>Cảm ơn bạn đã phản hồi!</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-amber-500">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-5 w-5 ${value <= currentRating ? "fill-amber-400 text-amber-400" : "text-emerald-200"}`}
            />
          ))}
        </div>
        {currentComment && <p className="mt-2 text-[11px] leading-relaxed text-emerald-600">“{currentComment}”</p>}
        <p className="mt-2 text-[11px] text-emerald-500/80">Phản hồi của bạn giúp chúng tôi cải thiện mỗi ngày.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-slate-200/80 bg-white/90 p-4 text-sm text-slate-600 shadow-sm">
      <p className="font-medium text-slate-800">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{helperText}</p>

      <div className="mt-3 flex items-center gap-1 text-slate-300">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = value <= displayRating;
          return (
            <button
              key={value}
              type="button"
              className={`transition-transform duration-150 ${!isSubmitting ? "hover:scale-110" : ""}`}
              onMouseEnter={() => !isSubmitting && setHoveredStar(value)}
              onMouseLeave={() => setHoveredStar(null)}
              onFocus={() => !isSubmitting && setHoveredStar(value)}
              onBlur={() => setHoveredStar(null)}
              onClick={() => !isSubmitting && setSelectedRating(value)}
              disabled={isSubmitting}
              aria-label={`Đánh giá ${value} sao`}
            >
              <Star className={`h-5 w-5 ${isActive ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
            </button>
          );
        })}
      </div>

      {validationMessage && <p className="mt-1 text-xs text-rose-500">{validationMessage}</p>}

      {displayRating > 0 && (
        <div className="mt-3 space-y-2">
          <span className="text-xs font-medium text-slate-500">
            Nhận xét bổ sung <span className="text-slate-400">(không bắt buộc)</span>
          </span>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Chia sẻ thêm về trải nghiệm hoặc mong muốn của bạn..."
            disabled={isSubmitting}
            rows={3}
            className="resize-none bg-white text-sm text-slate-700"
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" disabled={isSubmitting} onClick={handleSubmit} className="px-4">
          {isSubmitting ? "Đang gửi..." : submitLabel}
        </Button>
        <span className="text-xs text-slate-400">Sao & nhận xét của bạn sẽ giúp chúng tôi cải thiện dịch vụ.</span>
      </div>
    </div>
  );
};
