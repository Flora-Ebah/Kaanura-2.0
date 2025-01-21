import React from 'react';
import { useCart } from '../context/CartContext';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Footer from '../components/Footer';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getTotal } = useCart();

    return (
        <>
            <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
                {cartItems.length === 0 ? (
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
                                    <div key={item.name} className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                                        <img 
                                            src={item.img} 
                                            alt={item.name} 
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-light text-[#4A2B0F]">{item.name}</h3>
                                            <p className="text-[#8B5E34]">{item.price}</p>
                                            
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
                                            <span>{getTotal()} €</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Livraison</span>
                                            <span>Gratuite</span>
                                        </div>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>{getTotal()} €</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 px-8 py-3 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors">
                                        Procéder au paiement
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