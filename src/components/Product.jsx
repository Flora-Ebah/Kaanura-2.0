import React, { useState, useEffect } from 'react';
import { Modal, message, Alert } from 'antd';
import { useCart } from '../context/CartContext';
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { ShoppingOutlined } from '@ant-design/icons';

const ProductLoader = () => (
    <div className="py-24 bg-[#FDFBF7]">
        <div className="container mx-auto px-4">
            {/* Header skeleton */}
            <div className="mb-12 animate-pulse">
                <div className="w-20 h-[2px] bg-[#8B5E34]/20 mb-6"></div>
                <div className="w-32 h-4 bg-[#8B5E34]/10 rounded-full mb-3"></div>
                <div className="w-96 h-8 bg-[#8B5E34]/10 rounded-full mb-2"></div>
                <div className="w-72 h-6 bg-[#8B5E34]/10 rounded-full"></div>
            </div>

            {/* Products grid skeleton - Une seule ligne de 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="group">
                        <div className="relative mb-3 overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                            {/* Image skeleton avec overlay gradient */}
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5E34]/5 via-white/5 to-[#8B5E34]/10">
                                    <div className="absolute inset-0 bg-shimmer"></div>
                                </div>
                                {/* Overlay décoratif */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                            </div>
                            
                            {/* Content skeleton avec design moderne */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95">
                                {/* Title skeleton avec design élégant */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1 h-12 bg-gradient-to-b from-[#8B5E34]/30 to-[#8B5E34]/10 rounded-full"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-5 bg-gradient-to-r from-[#8B5E34]/10 to-[#8B5E34]/5 rounded-full w-3/4"></div>
                                        <div className="h-4 bg-gradient-to-r from-[#8B5E34]/10 to-[#8B5E34]/5 rounded-full w-1/2"></div>
                                    </div>
                                </div>
                                
                                {/* Price skeleton avec effet moderne */}
                                <div className="flex items-center justify-between mt-4">
                                    <div className="h-6 bg-gradient-to-r from-[#8B5E34]/20 to-[#8B5E34]/5 rounded-full w-1/3"></div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5E34]/10 to-[#8B5E34]/5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading indicator */}
            <div className="fixed bottom-8 right-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-full shadow-lg flex items-center space-x-3 border border-[#8B5E34]/10">
                <div className="relative">
                    <div className="w-6 h-6 border-2 border-[#8B5E34]/20 rounded-full">
                        <div className="absolute inset-0 border-2 border-[#8B5E34] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
                <span className="text-sm font-medium text-[#4A2B0F]">Chargement...</span>
            </div>
        </div>
    </div>
);

const Product = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Fonction pour formater le prix en FCFA
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    // Charger les produits depuis Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    price: formatPrice(doc.data().price) // Formater le prix
                }));
                setProducts(productsData);
            } catch (error) {
                console.error("Erreur lors du chargement des produits:", error);
                message.error("Erreur lors du chargement des produits");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
        setQuantity(1);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setQuantity(1);
    };

    const incrementQuantity = () => {
        if (quantity < selectedProduct.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const decrementQuantity = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };

    const handleAddToCart = async () => {
        const user = auth.currentUser;
        
        if (!user) {
            localStorage.setItem('pendingCartItem', JSON.stringify({
                productId: selectedProduct.id,
                quantity: quantity
            }));
            
            message.info("Veuillez vous connecter pour ajouter des produits au panier");
            closeModal();
            navigate('/login', { 
                state: { 
                    from: '/products',
                    message: "Connectez-vous pour ajouter des produits au panier" 
                }
            });
            return;
        }

        try {
            // Vérifier l'utilisateur dans la collection users
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) {
                message.error("Compte utilisateur non trouvé");
                return;
            }

            const userData = userSnap.data();
            
            // Vérifier si l'utilisateur a au moins une adresse
            if (!userData.addresses || userData.addresses.length === 0) {
                message.warning("Veuillez ajouter une adresse de livraison dans vos paramètres");
                navigate('/settings');
                return;
            }

            // Prendre la première adresse comme adresse de livraison par défaut
            const defaultAddress = userData.addresses[0];

            // Créer la commande dans Firestore
            const orderData = {
                userId: user.uid,
                customerName: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                phone: userData.phone || '',
                date: serverTimestamp(),
                createdAt: new Date().toISOString(),
                totalAmount: parseFloat(selectedProduct.price.replace(/[^\d]/g, '')),
                status: 'panier',
                items: [{
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    quantity: quantity,
                    price: parseFloat(selectedProduct.price.replace(/[^\d]/g, '')),
                    imageUrl: selectedProduct.imageUrl
                }],
                shippingAddress: {
                    type: defaultAddress.type,
                    street: defaultAddress.street,
                    city: defaultAddress.city,
                    postalCode: defaultAddress.postalCode,
                    country: defaultAddress.country
                },
                userInfo: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    createdAt: userData.createdAt,
                    type_user: userData.type_user
                }
            };

            const orderRef = await addDoc(collection(db, 'orders'), orderData);

            addToCart({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: quantity,
                imageUrl: selectedProduct.imageUrl,
                orderId: orderRef.id
            });

            message.success(`${quantity} ${selectedProduct.name} ajouté(s) au panier`);
            closeModal();

        } catch (error) {
            console.error("Erreur lors de l'ajout au panier:", error);
            message.error("Erreur lors de l'ajout au panier");
        }
    };

    if (loading) {
        return <ProductLoader />;
    }

    return (
        <section className="py-24 bg-[#FDFBF7]" id="nos-produits">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-start text-left mb-12">
                    <div className="w-20 h-[2px] bg-[#8B5E34] mb-6"></div>
                    <span className="text-[#8B5E34] font-medium tracking-wider uppercase text-sm mb-3">
                        Nos Produits
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light text-[#4A2B0F] max-w-2xl leading-tight">
                        Découvrez Notre Collection<br />
                        <span className="font-extralight text-2xl md:text-3xl mt-2 block text-[#8B5E34]/80">
                            Des soins capillaires naturels et efficaces
                        </span>
                    </h2>
                </div>

                <div className="relative overflow-hidden">
                    {/* Version mobile avec défilement horizontal */}
                    <div className="md:hidden overflow-x-auto hide-scrollbar">
                        <div className="flex space-x-4 px-4">
                            {products.map((product) => (
                                <div 
                                    key={product.id}
                                    className="group cursor-pointer flex-none w-[280px]"
                                    onClick={() => openModal(product)}
                                >
                                    <div className="relative mb-3 overflow-hidden">
                                        <div className="aspect-[3/4] rounded-lg overflow-hidden">
                                            <img 
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute aspect-[3/4] inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-500">
                                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-light">{product.name}</h3>
                                                </div>
                                                <p className="text-sm text-white/80 leading-relaxed font-light">
                                                    {product.price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Version desktop en grille */}
                    <div className="hidden md:grid md:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div 
                                key={product.id}
                                className="group cursor-pointer"
                                onClick={() => openModal(product)}
                            >
                                <div className="relative mb-3 overflow-hidden">
                                    <div className="aspect-[3/4] rounded-lg overflow-hidden">
                                        <img 
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-[1px] bg-[#8B5E34]"></div>
                                        <h3 className="text-lg font-light text-[#4A2B0F]">{product.name}</h3>
                                    </div>
                                    <p className="text-sm ml-6 text-gray-600 leading-relaxed font-light">
                                        {product.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                title={null}
                visible={isModalOpen}
                onCancel={closeModal}
                footer={null}
                className="modal-custom"
                width={800}
            >
                {selectedProduct && (
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                                    <img 
                                        src={selectedProduct.imageUrl}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2 space-y-4">
                                <h3 className="text-2xl font-light text-[#4A2B0F]">{selectedProduct.name}</h3>
                                <div className="w-20 h-[1px] bg-[#8B5E34]"></div>
                                <p className="text-xl font-light text-[#8B5E34]">{selectedProduct.price}</p>
                                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                                
                                <div className="space-y-2">
                                    <p className="font-medium text-[#4A2B0F]">
                                        Ingrédients: <span className="font-light">{selectedProduct.ingredient}</span>
                                    </p>
                                    <p className="font-medium text-[#4A2B0F]">
                                        Stock disponible: <span className="font-light">
                                            {selectedProduct.stock}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4 mt-6">
                                    <span className="text-[#4A2B0F] font-medium">Quantité:</span>
                                    <div className="flex items-center border border-[#8B5E34] rounded-full overflow-hidden">
                                        <button 
                                            onClick={decrementQuantity}
                                            className="px-4 py-2 text-[#8B5E34] hover:bg-[#8B5E34] hover:text-white transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 text-[#4A2B0F] min-w-[40px] text-center">
                                            {quantity}
                                        </span>
                                        <button 
                                            onClick={incrementQuantity}
                                            className={`px-4 py-2 text-[#8B5E34] hover:bg-[#8B5E34] hover:text-white transition-colors
                                                ${selectedProduct.stock <= quantity ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={selectedProduct.stock <= quantity}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    className="w-full mt-6 px-8 py-3 bg-[#8B5E34] text-white rounded-full hover:bg-[#4A2B0F] transition-colors flex items-center justify-center space-x-2"
                                    onClick={handleAddToCart}
                                >
                                    <span>Ajouter au panier</span>
                                    <span className="text-sm">({quantity})</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default Product; 