import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

type CartItem = {
  ProductID: string;
  Quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateProductQuantityInCart: (id: string, Quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const res = await api.get("/carts");
      console.log("cart: ", res);
      setCart(res.data);
    } catch (err) {
      console.error("Lỗi fetch cart:", err);
    }
  };

  const addToCart = async (item: CartItem) => {
    await api.post("/carts", item);
    await fetchCart();
  };

  const updateProductQuantityInCart = async (id: string, Quantity: number) => {
    await api.patch(`/carts/${id}`, { Quantity });
    await fetchCart();
  };

  const removeFromCart = async (id: string) => {
    await api.delete(`/carts/${id}`);
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        updateProductQuantityInCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải dùng trong <CartProvider>");
  return context;
};
