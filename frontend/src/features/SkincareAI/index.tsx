import { Tooltip } from "@radix-ui/react-tooltip";
import { BadgeCheck, Building2, FlaskConical, Info, Ruler, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import BudgetSlider from "./components/BudgetSlider";
import ChatContainer from "./components/ChatContainer";
import FilterAccordionItem from "./components/FilterAccordionItem";
import ImageUpload from "./components/ImageUpload";
import PreferenceButtons from "./components/PreferenceButtons";
import { useSkincareAI } from "./components/hooks/useSkincareAI";
import { useAuth } from "@/contexts/auth.context"; 
import type{ RoutineDetailsForSaving } from "./types";

const SkincareAI = () => {
  const {
    uploadedImageBase64,
    preference,
    budget,
    messages,
    isAnalyzing,
    allFilterOptions,
    isFilterOptionsLoading,
    filterOptionsError,
    selectedUserSkinType,
    selectedBrands,
    selectedIngredients,
    selectedProductTypes,
    selectedUses,
    selectedCharacteristics,
    selectedSizes,
    setPreference,
    setBudget,
    setSelectedUserSkinType,
    setSelectedBrands,
    setSelectedIngredients,
    setSelectedProductTypes,
    setSelectedUses,
    setSelectedCharacteristics,
    setSelectedSizes,
    handleImageUpload,
    handleImageRemove,
    handleSubmit,
    handleClearAllFilters,
    handleFeedbackSubmit,
  } = useSkincareAI();
  
  const navigate = useNavigate();
  if (filterOptionsError) {
    toast.error(filterOptionsError.message || "Không thể tải các tùy chọn bộ lọc.");
  }
const handleApplyRoutine = (routineData: RoutineDetailsForSaving) => {
    if (!routineData) return;
    navigate("/confirm-routine", {
      state: { routine: routineData },
    });
  };
  const { isAuthenticated } = useAuth();
  return (
    <section id="ai-section" className="pt-16">
      <div className="bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-fade-in mb-12 text-center">
            <h2 className="mb-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
              AI Giải Pháp Làn Da
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-600">
              Tải lên ảnh của bạn và các sở thích để khám phá quy trình chăm sóc da được tạo riêng cho bạn!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {}
            <div className="lg:col-span-6 xl:col-span-4">
              <div className="animate-fade-in sticky top-8 space-y-6 rounded-xl bg-white p-6 shadow-2xl">
                <ImageUpload onImageUpload={handleImageUpload} onImageRemove={handleImageRemove} />
                <div>
                  <h3 className="mb-2 text-center font-semibold text-gray-700">Sở Thích Quy Trình</h3>
                  <PreferenceButtons selectedPreference={preference} onPreferenceChange={setPreference} />
                </div>
                <div>
                  <BudgetSlider budget={budget} onBudgetChange={setBudget} />
                </div>

                {}
                {isFilterOptionsLoading && <p className="py-4 text-center text-sm text-gray-500">Đang tải bộ lọc...</p>}
                {!isFilterOptionsLoading && allFilterOptions && (
                  <div className="space-y-1 border-t border-gray-200 pt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center text-lg font-semibold text-gray-700">
                        <Sparkles size={20} className="text-primary mr-2" />
                        Tinh Chỉnh Tìm Kiếm
                      </h3>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={handleClearAllFilters}
                        className="text-primary hover:text-primary/80 h-auto p-0 text-xs"
                      >
                        <Trash2 size={14} className="mr-1" /> Xóa Tất Cả
                      </Button>
                    </div>

                    {}
                    {allFilterOptions.filter_hsk_skin_type && (
                      <div className="pb-3">
                        <label htmlFor="userSkinTypeSelect" className="mb-1 block text-sm font-medium text-gray-600">
                          Loại Da Của Bạn <span className="text-xs text-gray-400">(Tùy chọn)</span>
                        </label>
                        <Select
                          value={selectedUserSkinType || "let_ai_diagnose"}
                          onValueChange={(value) =>
                            setSelectedUserSkinType(value === "let_ai_diagnose" ? undefined : value)
                          }
                        >
                          <SelectTrigger className="w-full text-sm">
                            <SelectValue placeholder="Để AI Chẩn Đoán" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="let_ai_diagnose">Để AI Chẩn Đoán</SelectItem>
                            {allFilterOptions.filter_hsk_skin_type.map((st) => (
                              <SelectItem key={st.filter_ID} value={st.name}>
                                {st.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Accordion type="multiple" className="w-full">
                      {allFilterOptions.filter_brand && allFilterOptions.filter_brand.length > 0 && (
                        <FilterAccordionItem
                          title="Thương Hiệu Ưa Thích"
                          icon={<Building2 size={16} className="mr-2 text-gray-500" />}
                          options={allFilterOptions.filter_brand}
                          selectedValues={selectedBrands}
                          onSelectionChange={setSelectedBrands}
                          value="brands"
                        />
                      )}
                      {allFilterOptions.filter_hsk_product_type &&
                        allFilterOptions.filter_hsk_product_type.length > 0 && (
                          <div className="relative">
                            <FilterAccordionItem
                              title="Loại Sản Phẩm"
                              icon={<ShoppingBag size={16} className="mr-2 text-gray-500" />}
                              options={allFilterOptions.filter_hsk_product_type}
                              selectedValues={selectedProductTypes}
                              onSelectionChange={setSelectedProductTypes}
                              value="productTypes"
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="absolute top-4.5 right-10">
                                    <Info size={14} className="text-gray-400 hover:text-gray-600" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="">
                                    Bộ lọc này hoạt động như một gợi ý để giúp AI ưu tiên các loại sản phẩm.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      {allFilterOptions.filter_hsk_uses && allFilterOptions.filter_hsk_uses.length > 0 && (
                        <div className="relative">
                          <FilterAccordionItem
                            title="Tác Dụng/Hiệu Quả Mong Muốn"
                            icon={<Sparkles size={16} className="mr-2 text-gray-500" />}
                            options={allFilterOptions.filter_hsk_uses}
                            selectedValues={selectedUses}
                            onSelectionChange={setSelectedUses}
                            value="uses"
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="absolute top-4.5 right-10">
                                  <Info size={14} className="text-gray-400 hover:text-gray-600" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Bộ lọc này giúp AI hiểu được kết quả mong muốn của bạn cho quy trình chăm sóc.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                      {allFilterOptions.filter_hsk_ingredient && allFilterOptions.filter_hsk_ingredient.length > 0 && (
                        <FilterAccordionItem
                          title="Thành Phần Chính (từ Tags)"
                          icon={<FlaskConical size={16} className="mr-2 text-gray-500" />}
                          options={allFilterOptions.filter_hsk_ingredient}
                          selectedValues={selectedIngredients}
                          onSelectionChange={setSelectedIngredients}
                          value="hsk_ingredients"
                        />
                      )}
                      {allFilterOptions.filter_dac_tinh && allFilterOptions.filter_dac_tinh.length > 0 && (
                        <FilterAccordionItem
                          title="Đặc Tính Sản Phẩm"
                          icon={<BadgeCheck size={16} className="mr-2 text-gray-500" />}
                          options={allFilterOptions.filter_dac_tinh}
                          selectedValues={selectedCharacteristics}
                          onSelectionChange={setSelectedCharacteristics}
                          value="characteristics"
                        />
                      )}
                      {allFilterOptions.filter_hsk_size && allFilterOptions.filter_hsk_size.length > 0 && (
                        <FilterAccordionItem
                          title="Kích Thước Sản Phẩm"
                          icon={<Ruler size={16} className="mr-2 text-gray-500" />}
                          options={allFilterOptions.filter_hsk_size}
                          selectedValues={selectedSizes}
                          onSelectionChange={setSelectedSizes}
                          value="sizes"
                        />
                      )}
                    </Accordion>
                  </div>
                )}
                {}

                <div className="mt-8 flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isAnalyzing || !uploadedImageBase64}
                    className="bg-primary hover:bg-primary/90 flex-1 py-3 text-white"
                  >
                    {isAnalyzing ? "Đang Phân Tích..." : "Nhận Quy Trình Của Tôi"}
                  </Button>
                </div>
              </div>
            </div>

            {}
            <div className="lg:col-span-6 xl:col-span-8">
              <ChatContainer
                messages={messages}
                isAnalyzing={isAnalyzing}
                onApplyRoutine={handleApplyRoutine}
                isAuthenticated={isAuthenticated}
                onRateFeedback={handleFeedbackSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkincareAI;
