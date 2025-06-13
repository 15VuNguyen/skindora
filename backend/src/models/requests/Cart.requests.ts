export interface ProductInCart {
    ProductID: string
    Quantity: number
}

export interface ProductInCache {
    _id: string,
    name: string,
    image: string,
    price: string
}

export interface AddToCartPayload{
    ProductID: string
    Quantity: number
}

export interface UpdateCartPayload{
    Quantity: number
}

export interface CartParams{
    productId: string
}

export interface Cart{
    Products: Array<ProductInCart>
}