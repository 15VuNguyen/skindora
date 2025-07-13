
import { MongoProduct, AISchemaProduct, FilterPathTag, PopulatedFilterType } from '~/models/types/Ai.types'
import logger from '~/utils/logger'

export function transformMongoToAISchema(mongoProduct: MongoProduct, contextSkinConcern: string): AISchemaProduct {
  const reconstructedFilterPathTags: FilterPathTag[] = []

  const addTag = (populatedField: PopulatedFilterType | null | undefined) => {
    if (
      populatedField &&
      typeof populatedField === 'object' &&
      populatedField._id
    ) {
      reconstructedFilterPathTags.push({
        category_name: populatedField.category_name,
        category_param: populatedField.category_param,
        option_id: populatedField.option_id,
        option_name: populatedField.option_name,
        filter_doc_id: populatedField._id.toString()
      })
    }
  }

  addTag(mongoProduct.filter_brand)
  addTag(mongoProduct.filter_dac_tinh)
  addTag(mongoProduct.filter_hsk_ingredient)
  addTag(mongoProduct.filter_hsk_product_type)
  addTag(mongoProduct.filter_hsk_size)
  addTag(mongoProduct.filter_hsk_skin_type)
  addTag(mongoProduct.filter_hsk_uses)

  let brandName = 'N/A'
  if (mongoProduct.filter_brand?.option_name) {
    brandName = mongoProduct.filter_brand.option_name
  } else {
    logger.warn(`Brand name could not be determined for product: ${mongoProduct._id}`)
  }

  const descriptionPlainText = mongoProduct.description_detail?.plainText || 'Content is being updated'

  return {
    skinConcern: contextSkinConcern,
    image: mongoProduct.image_on_list,
    onHoverImage: mongoProduct.hover_image_on_list,
    price: mongoProduct.price_on_list,
    brand: brandName,
    name: mongoProduct.name_on_list,
    urlDetail: `/product/${mongoProduct._id.toString()}`,
    filter_path_tags: reconstructedFilterPathTags.length > 0 ? reconstructedFilterPathTags : undefined,
    Detail: {
      MainImage: mongoProduct.main_images_detail || [],
      subImages: mongoProduct.sub_images_detail || [],
      engName: mongoProduct.engName_detail || mongoProduct.engName_on_list || null,
      desciption: descriptionPlainText,
      productName: mongoProduct.productName_detail,
      ingredients: mongoProduct.ingredients_detail?.plainText || 'Content is being updated',
      howToUse: mongoProduct.guide_detail?.plainText || 'Content is being updated'
    }
  }
}