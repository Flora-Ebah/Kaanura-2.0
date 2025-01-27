import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity, id ) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.name === product.name);
            
            if (existingItem) {
                return prevItems.map(item =>
                    item.name === product.name
                        ? { ...item, quantity: item.quantity + quantity, identifiant:id, status:"En cours" }
                        : item
                );
            }
            
            return [...prevItems, { ...product, quantity }];
        });
    };

    const updateQuantity = (product, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(product);
            return;
        }
        
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.name === product.name
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (product) => {
        setCartItems(prevItems => 
            prevItems.filter(item => item.name !== product.name)
        );
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace('€', '').trim());
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            updateQuantity, 
            removeFromCart, 
            getCartCount,
            getTotal 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext); 