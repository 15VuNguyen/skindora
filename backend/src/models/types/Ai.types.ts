
import { ObjectId } from 'mongodb';
import { LanguageOption } from '../requests/Ai.requests';
import type { SkincareAdvisorRequestBody } from '../requests/Ai.requests';
export interface PopulatedFilterType {
  _id: ObjectId;
  option_name: string;
  option_id: string;
  category_name: string;
  category_param: string;
}

export interface DetailTextHtml {
  plainText: string;
  rawHtml: string;
}
export interface FilterOptionType {
  name: string;
  filter_ID: string;
}

export interface MongoProduct {
  _id: ObjectId;
  name_on_list: string;
  engName_on_list: string | null;
  price_on_list: string;
  image_on_list: string;
  hover_image_on_list: string;
  product_detail_url: string;
  productName_detail: string;
  engName_detail: string | null;
  description_detail?: DetailTextHtml | null;
  ingredients_detail?: DetailTextHtml | null;
  guide_detail?: DetailTextHtml | null;
  specification_detail?: DetailTextHtml | null;
  main_images_detail?: string[] | null;
  sub_images_detail?: string[] | null;
  filter_brand?: PopulatedFilterType | null;
  filter_dac_tinh?: PopulatedFilterType | null;
  filter_hsk_ingredient?: PopulatedFilterType | null;
  filter_hsk_product_type?: PopulatedFilterType | null;
  filter_hsk_size?: PopulatedFilterType | null;
  filter_hsk_skin_type?: PopulatedFilterType | null;
  filter_hsk_uses?: PopulatedFilterType | null;
  filter_origin?: string | null;
  Quantity?: number;
  details_scraped_at?: string;
}
export interface FilterPathTag {
  category_name: string;
  category_param: string;
  option_id: string;
  option_name: string;
  filter_doc_id?: string;
}
export interface AISchemaProductDetail {
  MainImage: string[];
  subImages: string[];
  engName: string | null;
  desciption: string; 
  productName: string;
  ingredients: string;
  howToUse: string;
}

export interface AISchemaProduct {
  skinConcern: string;
  image: string;
  onHoverImage: string;
  price: string;
  brand: string;
  name: string;
  urlDetail: string;
  Detail: AISchemaProductDetail;
  filter_path_tags?: FilterPathTag[];
}


export interface AdvisorRequest extends SkincareAdvisorRequestBody {} 

export interface AiSuggestedFilterCriteria {
  suggestedProductCategories?: string[];
  keyIngredientsToLookFor?: string[];
  ingredientsToAvoid?: string[];
  desiredBenefits?: string[];
}

export interface UserPreferencesForPrompt {
  userPreferredSkinType?: string;
  preferredBrands?: string[];
  language?: LanguageOption;
  preferredIngredients?: string[];
  preferredOrigins?: string[];
  preferredProductTypes?: string[];
  preferredUses?: string[];
  preferredCharacteristics?: string[];
  preferredSizes?: string[];
}

export interface RoutineSelectionFilterCriteria {
  userPreferences?: UserPreferencesForPrompt;
  aiSuggestions?: AiSuggestedFilterCriteria;
}