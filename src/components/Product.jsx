import React, { useState,useEffect } from 'react';
import { Modal } from 'antd';
import { useCart } from '../context/CartContext';
import { message } from 'antd';
import { child, get, ref } from "firebase/database";
import { db } from "/lib/firebase";



const Product = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [Products, setProducts] = useState();
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

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
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };

    const handleAddToCart = (id) => {
        addToCart(selectedProduct, quantity,id);
        message.success(`${quantity} ${selectedProduct.title} ajouté(s) au panier`);
        closeModal();
    };


    useEffect(() => {
        const dbRef = ref(db);
        get(child(dbRef, `produits/`)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
             setProducts(snapshot.val())
          } else {
            // console.log("No data available");
            setProducts(null);
          }
        }).catch((error) => {
          console.error(error);
          setProducts(null);
         
        });
      },[])



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
                            {Products ? Object.values(Products).map((product, index) => (
                                <div 
                                    key={index}
                                    className="group cursor-pointer flex-none w-[280px]"
                                    onClick={() => openModal(product)}
                                >
                                    <div className="relative mb-3 overflow-hidden">
                                        <div className="aspect-[3/4] rounded-lg overflow-hidden">
                                            <img 
                                                src={product.img}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute aspect-[3/4] inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-500">
                                            <div className="absolute bottom-0 left-0 p-4 text-white">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-light">{product.title}</h3>
                                                </div>
                                                <p className="text-sm text-white/80 leading-relaxed font-light">
                                                    {product.price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : <h1 className='text-center text-2xl'> Aucun produit disponible</h1>}
                        </div>
                    </div>

                    {/* Version desktop en grille */}
                    <div className="hidden md:grid md:grid-cols-3 gap-8">
                        {Products ? Object.values(Products).map((product, index) => (
                            <div 
                                key={`desktop-${index}`}
                                className="group cursor-pointer"
                                onClick={() => openModal(product)}
                            >
                                <div className="relative mb-3 overflow-hidden">
                                    <div className="aspect-[3/4] rounded-lg overflow-hidden">
                                        <img 
                                            src={product.img}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-[1px] bg-[#8B5E34]"></div>
                                        <h3 className="text-lg font-light text-[#4A2B0F]">{product.title}</h3>
                                    </div>
                                    <p className="text-sm ml-6 text-gray-600 leading-relaxed font-light">
                                        {product.price}
                                    </p>
                                </div>
                            </div>
                        ) ): <h1 className='text-center text-2xl'> Aucun produit disponible</h1>}
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
                                        src={selectedProduct.img}
                                        alt={selectedProduct.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="md:w-1/2 space-y-4">
                                <h3 className="text-2xl font-light text-[#4A2B0F]">{selectedProduct.title}</h3>
                                <div className="w-20 h-[1px] bg-[#8B5E34]"></div>
                                <p className="text-xl font-light text-[#8B5E34]">{selectedProduct.price}</p>
                                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                                <div className="space-y-2">
                                    <p className="font-medium text-[#4A2B0F]">Quantité: <span className="font-light">{selectedProduct.quantite}</span></p>
                                    <p className="font-medium text-[#4A2B0F]">Ingrédients: <span className="font-light">{selectedProduct.ingredient}</span></p>
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
                                            className="px-4 py-2 text-[#8B5E34] hover:bg-[#8B5E34] hover:text-white transition-colors"
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