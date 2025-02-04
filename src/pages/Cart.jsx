import React, { useState, useEffect } from 'react';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import Footer from '../components/Footer';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const navigate = useNavigate();

    // Écouter l'état de l'authentification
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    // Charger les articles du panier une fois que l'utilisateur est authentifié
    useEffect(() => {
        let unsubscribeOrders = null;

        const fetchCartItems = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid),
                    where('status', '==', 'panier')
                );

                unsubscribeOrders = onSnapshot(q, (snapshot) => {
                    let allItems = [];
                    // Collecter tous les items de toutes les commandes
                    snapshot.forEach(doc => {
                        const order = doc.data();
                        if (order.items && order.items.length > 0) {
                            allItems = [...allItems, ...order.items.map(item => ({
                                ...item,
                                orderId: doc.id
                            }))];
                        }
                    });

                    // Regrouper les items identiques
                    const groupedItems = allItems.reduce((acc, item) => {
                        const existingItem = acc.find(i => i.id === item.id);
                        if (existingItem) {
                            // Si l'item existe déjà, ajouter la quantité et garder tous les orderIds
                            existingItem.quantity += item.quantity;
                            existingItem.orderIds = [...new Set([...existingItem.orderIds, item.orderId])];
                        } else {
                            // Si c'est un nouvel item, l'ajouter avec un tableau d'orderIds
                            acc.push({
                                ...item,
                                orderIds: [item.orderId]
                            });
                        }
                        return acc;
                    }, []);

                    setCartItems(groupedItems);
                    setLoading(false);
                    setDataLoaded(true);
                }, (error) => {
                    console.error("Erreur lors de l'écoute du panier:", error);
                    message.error("Erreur lors du chargement du panier");
                    setLoading(false);
                    setDataLoaded(true);
                });

            } catch (error) {
                console.error("Erreur lors du chargement du panier:", error);
                message.error("Erreur lors du chargement du panier");
                setLoading(false);
                setDataLoaded(true);
            }
        };

        fetchCartItems();

        return () => {
            if (unsubscribeOrders) {
                unsubscribeOrders();
            }
        };
    }, [user]);

    const updateQuantity = async (item, newQuantity) => {
        const user = auth.currentUser;
        if (!user) {
            message.error("Veuillez vous connecter");
            return;
        }

        if (newQuantity < 1) {
            await removeFromCart(item);
            return;
        }

        try {
            const orderRef = doc(db, 'orders', item.orderId);
            const orderSnap = await getDoc(orderRef);
            
            if (!orderSnap.exists()) {
                message.error("Commande introuvable");
                return;
            }

            const orderData = orderSnap.data();
            
            // Vérifier le stock disponible
            const productRef = doc(db, 'products', item.id);
            const productSnap = await getDoc(productRef);
            
            if (!productSnap.exists()) {
                message.error("Produit non trouvé");
                return;
            }

            const productData = productSnap.data();
            if (newQuantity > productData.stock) {
                message.warning(`Stock disponible: ${productData.stock}`);
                return;
            }

            // Mettre à jour les items de la commande
            const updatedItems = orderData.items.map(orderItem => {
                if (orderItem.id === item.id) {
                    return {
                        ...orderItem,
                        quantity: newQuantity,
                        totalPrice: newQuantity * orderItem.price
                    };
                }
                return orderItem;
            });

            // Calculer le nouveau total de la commande
            const newTotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

            // Mettre à jour la commande
            await updateDoc(orderRef, {
                items: updatedItems,
                totalAmount: newTotal,
                updatedAt: serverTimestamp()
            });

            // Mettre à jour l'état local
            setCartItems(prev => prev.map(cartItem => 
                cartItem.id === item.id 
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
            ));

            message.success("Quantité mise à jour");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la quantité:", error);
            message.error("Erreur lors de la mise à jour");
        }
    };

    const removeFromCart = async (item) => {
        const user = auth.currentUser;
        if (!user) {
            message.error("Veuillez vous connecter");
            return;
        }

        try {
            // Mettre à jour chaque commande qui contient ce produit
            for (const orderId of item.orderIds) {
                const orderRef = doc(db, 'orders', orderId);
                const orderSnap = await getDoc(orderRef);
                
                if (!orderSnap.exists()) continue;

                const orderData = orderSnap.data();
                
                // Si c'est le seul article de la commande
                if (orderData.items.length === 1) {
                    await deleteDoc(orderRef);
                } else {
                    const updatedItems = orderData.items.filter(orderItem => orderItem.id !== item.id);
                    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    
                    await updateDoc(orderRef, {
                        items: updatedItems,
                        totalAmount: newTotal,
                        updatedAt: serverTimestamp()
                    });
                }
            }
            
            message.success("Article(s) supprimé(s) du panier");
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            message.error("Erreur lors de la suppression");
        }
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleCheckout = async () => {
        const user = auth.currentUser;
        if (!user) {
            message.error("Veuillez vous connecter pour passer commande");
            return;
        }

        try {
            emailjs.init("BsNolhO31AKSsIfBy");

            const shopDoc = await getDoc(doc(db, 'shop', 'info'));
            if (!shopDoc.exists()) {
                throw new Error("Informations de la boutique non trouvées");
            }
            const shopData = shopDoc.data();

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                throw new Error("Informations du client non trouvées");
            }
            const userData = userDoc.data();

            // Créer le HTML du tableau directement
            const itemsTableHtml = `
                <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                    <thead>
                        <tr style="background-color: #f8f8f8;">
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Produit</th>
                            <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Quantité</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Prix unitaire</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cartItems.map(item => `
                            <tr>
                                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.name}</td>
                                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${item.price} FCFA</td>
                                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">${item.price * item.quantity} FCFA</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background-color: #f8f8f8;">
                            <td colspan="3" style="padding: 10px; text-align: right; border-top: 2px solid #ddd;"><strong>Total</strong></td>
                            <td style="padding: 10px; text-align: right; border-top: 2px solid #ddd;"><strong>${getTotal()} FCFA</strong></td>
                        </tr>
                    </tfoot>
                </table>
            `;

            const q = query(
                collection(db, 'orders'),
                where('userId', '==', user.uid),
                where('status', '==', 'panier')
            );
            const snapshot = await getDocs(q);

            const templateParams = {
                to_name: shopData.name,
                to_email: shopData.email,
                from_name: "KAANURA",
                customer_name: `${userData.firstName} ${userData.lastName}`,
                customer_email: userData.email,
                order_id: snapshot.docs.map(doc => doc.id).join(', '),
                order_date: new Date().toLocaleDateString('fr-FR'),
                order_total: `${getTotal()} FCFA`,
                items_table: itemsTableHtml,
                orders_count: snapshot.docs.length > 1 ? 
                    `(${snapshot.docs.length} commandes groupées)` : '',
                reply_to: userData.email
            };

            await emailjs.send(
                'service_zo719yo',
                'template_c26pc6s',
                templateParams,
                'BsNolhO31AKSsIfBy'
            );

            const updatePromises = snapshot.docs.map(doc => 
                updateDoc(doc.ref, {
                    status: 'En attente',
                    orderDate: new Date().toISOString()
                })
            );

            await Promise.all(updatePromises);
            message.success("Commande passée avec succès!");
            setCartItems([]);
        } catch (error) {
            console.error("Erreur lors de la commande:", error);
            message.error("Erreur lors de la commande");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5e6]">
                <h2 className="text-xl font-medium text-[#4A2B0F] mb-4">
                    Connexion requise
                </h2>
                <p className="text-[#8B5E34] mb-6">
                    Veuillez vous connecter pour accéder à votre panier
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors"
                >
                    Se connecter
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5e6]">
                <div className="w-16 h-16 border-4 border-[#8B5E34] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#4A2B0F]">Chargement de votre panier...</p>
            </div>
        );
    }

    return (
        <>
            <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
                {dataLoaded && cartItems.length === 0 ? (
                    <div className="container mx-auto text-center pt-48">
                        <h2 className="text-2xl font-light text-[#4A2B0F] mb-4">Votre panier est vide</h2>
                        <p className="text-[#8B5E34]">Découvrez nos produits et commencez votre shopping</p>
                    </div>
                ) : (
                    <div className="container mx-auto pt-48">
                        <h1 className="text-3xl font-light text-[#4A2B0F] mb-8">Votre Panier</h1>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.name} 
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-light text-[#4A2B0F]">{item.name}</h3>
                                            <p className="text-[#8B5E34]">{item.price} FCFA</p>
                                            
                                            <div className="flex items-center mt-4 space-x-4">
                                                <div className="flex items-center border border-[#8B5E34] rounded-full overflow-hidden">
                                                    <button 
                                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                                        className="px-3 py-1 text-[#8B5E34] hover:bg-[#8B5E34] hover:text-white transition-colors"
                                                    >
                                                        <MinusOutlined />
                                                    </button>
                                                    <span className="px-4 py-1 text-[#4A2B0F]">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                                        className="px-3 py-1 text-[#8B5E34] hover:bg-[#8B5E34] hover:text-white transition-colors"
                                                    >
                                                        <PlusOutlined />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <DeleteOutlined />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="md:col-span-1">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-light text-[#4A2B0F] mb-4">Résumé de la commande</h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span>Sous-total</span>
                                            <span>{getTotal()} FCFA</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Livraison</span>
                                            <span>Gratuite</span>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>{getTotal()} FCFA</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleCheckout}
                                        className="w-full mt-6 px-8 py-3 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors"
                                    >
                                        Passer la commande
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart; 