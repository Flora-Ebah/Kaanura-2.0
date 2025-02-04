import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);

    // Écouter les changements d'état de l'authentification
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribeAuth();
    }, []);

    // Écouter les changements dans les commandes en temps réel
    useEffect(() => {
        let unsubscribeOrders = null;

        if (user) {
            const cartQuery = query(
                collection(db, 'orders'),
                where('userId', '==', user.uid),
                where('status', '==', 'panier')
            );

            unsubscribeOrders = onSnapshot(cartQuery, (snapshot) => {
                let totalItems = 0;
                const items = [];

                snapshot.forEach(doc => {
                    const orderData = doc.data();
                    if (orderData.items && Array.isArray(orderData.items)) {
                        const orderItems = orderData.items.map(item => ({
                            ...item,
                            orderId: doc.id
                        }));
                        items.push(...orderItems);
                        totalItems += orderData.items.reduce((sum, item) => sum + item.quantity, 0);
                    }
                });

                setCartItems(items);
                setCartCount(totalItems);
            });
        } else {
            setCartItems([]);
            setCartCount(0);
        }

        return () => {
            if (unsubscribeOrders) {
                unsubscribeOrders();
            }
        };
    }, [user]);

    const addToCart = (product) => {
        // Cette fonction est maintenant juste un placeholder
        // La mise à jour réelle est gérée par le listener onSnapshot
        console.log("Produit ajouté au panier:", product);
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

    const value = {
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCartCount: () => cartCount,
        getTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
}; 