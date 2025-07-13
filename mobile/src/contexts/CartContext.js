import { createContext, useState, useEffect } from "react";
import axios from "../utils/axiosPrivate";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const {data} = await axios.get("/carts");
      console.log(data.result)
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
    fetchCart();
  }, []);

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
