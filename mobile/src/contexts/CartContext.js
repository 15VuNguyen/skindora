import { createContext, useState, useEffect } from "react";
import axios from "../utils/axiosPrivate";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { accessToken } = useAuth();

  const fetchCart = async () => {
    if (!accessToken) return;
    try {
      const { data } = await axios.get("/carts");
      setCart(data.result);
    } catch (err) {
      console.error("Lỗi fetch cart:", err);
    }
  };

  const addToCart = async (item) => {
    await axios.post("/carts", item);
    await fetchCart();
  };

  const updateProductQuantityInCart = async (id, Quantity) => {
    await axios.patch(`/carts/${id}`, { Quantity });
    await fetchCart();
  };

  const removeFromCart = async (id) => {
    await axios.delete(`/carts/${id}`);
    await fetchCart();
  };

  useEffect(() => {
    if (accessToken) {
      fetchCart();
    }else{
      setCart([])
    }
  }, [accessToken]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
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
