import React, { useEffect, useRef } from 'react';

const WhyChooseOurProducts = () => {
    const scrollRef = useRef(null);
    
    const products = [
        {
            title: "Shampoing Naturel",
            description: "Un shampoing bio enrichi en huiles essentielles pour nourrir vos cheveux.",
            imageUrl: "https://i.pinimg.com/236x/21/c2/ac/21c2acf5f90db34e68b233a1f02c1c93.jpg"
        },
        {
            title: "Après-shampoing Revitalisant",
            description: "Hydrate et protège vos cheveux tout en leur donnant de l'éclat.",
            imageUrl: "https://i.pinimg.com/236x/02/28/3d/02283d578375ff9a39523eb99244887b.jpg"
        },
        {
            title: "Masque Capillaire Réparateur",
            description: "Un soin profond pour réparer les cheveux abîmés.",
            imageUrl: "https://i.pinimg.com/736x/52/a4/cc/52a4cc8c675a0e019583d202c9df1a92.jpg"
        },
        {
            title: "Huile Nourrissante",
            description: "Une huile naturelle pour fortifier vos cheveux.",
            imageUrl: "https://i.pinimg.com/474x/09/19/5b/09195b927750a0761462698bfa854bfe.jpg"
        },
        {
            title: "Crème Coiffante",
            description: "Créez des styles uniques tout en protégeant vos cheveux.",
            imageUrl: "https://i.pinimg.com/236x/dd/90/fb/dd90fbc63768cd5b0be4404f07b6f313.jpg"
        }
    ];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        let scrollInterval;

        const startAutoScroll = () => {
            if (window.innerWidth < 1024) { // Changé de 768 à 1024 pour inclure sm et md
                scrollInterval = setInterval(() => {
                    if (scrollContainer) {
                        const isAtEnd = scrollContainer.scrollLeft + scrollContainer.offsetWidth >= scrollContainer.scrollWidth;
                        
                        if (isAtEnd) {
                            scrollContainer.scrollLeft = 0;
                        } else {
                            scrollContainer.scrollLeft += 200;
                        }
                    }
                }, 3000);
            }
        };

        const stopAutoScroll = () => {
            clearInterval(scrollInterval);
        };

        startAutoScroll();

        // Arrêter le défilement lors du toucher/survol
        if (scrollContainer) {
            scrollContainer.addEventListener('touchstart', stopAutoScroll);
            scrollContainer.addEventListener('mouseover', stopAutoScroll);
            scrollContainer.addEventListener('touchend', startAutoScroll);
            scrollContainer.addEventListener('mouseout', startAutoScroll);
        }

        // Nettoyage
        return () => {
            clearInterval(scrollInterval);
            if (scrollContainer) {
                scrollContainer.removeEventListener('touchstart', stopAutoScroll);
                scrollContainer.removeEventListener('mouseover', stopAutoScroll);
                scrollContainer.removeEventListener('touchend', startAutoScroll);
                scrollContainer.removeEventListener('mouseout', startAutoScroll);
            }
        };
    }, []);

    return (
        <section className="py-24 bg-[#FDFBF7]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-start text-left mb-12">
                    <div className="w-20 h-[2px] bg-[#8B5E34] mb-6"></div>
                    <span className="text-[#8B5E34] font-medium tracking-wider uppercase text-sm mb-3">
                        Notre Engagement
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light text-[#4A2B0F] max-w-2xl leading-tight">
                        L'Excellence Capillaire<br />
                        <span className="font-extralight text-2xl md:text-3xl mt-2 block text-[#8B5E34]/80">
                            Des soins naturels inspirés par la nature, formulés avec passion
                        </span>
                    </h2>
                </div>

                <div className="relative overflow-hidden">
                    <div className="lg:grid lg:grid-cols-5 gap-4 max-w-7xl lg:mx-0 lg:px-0">
                        <div className="flex lg:contents group/scroll" ref={scrollRef}>
                            <div className="flex animate-scroll lg:hidden">
                                {products.map((product, index) => (
                                    <div 
                                        key={index}
                                        className="group flex-none w-[200px] md:w-auto shrink-0 px-2 first:pl-4 last:pr-4"
                                    >
                                        <div className="relative mb-3 overflow-hidden">
                                            <div className="aspect-[3/4] rounded-lg overflow-hidden w-[200px]">
                                                <img 
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="absolute aspect-[3/4] inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-500">
                                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h3 className="text-lg font-light">
                                                            {product.title}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-white/80 leading-relaxed font-light">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex animate-scroll lg:hidden" aria-hidden="true">
                                {products.map((product, index) => (
                                    <div 
                                        key={`clone-${index}`}
                                        className="group flex-none w-[200px] md:w-auto shrink-0 px-2 first:pl-4 last:pr-4"
                                    >
                                        <div className="relative mb-3 overflow-hidden">
                                            <div className="aspect-[3/4] rounded-lg overflow-hidden w-[200px]">
                                                <img 
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="absolute aspect-[3/4] inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-500">
                                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h3 className="text-lg font-light">
                                                            {product.title}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-white/80 leading-relaxed font-light">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Version desktop */}
                            <div className="hidden lg:contents">
                                {products.map((product, index) => (
                                    <div 
                                        key={`desktop-${index}`}
                                        className="group flex-none w-[200px] md:w-auto shrink-0 px-2 first:pl-4 last:pr-4"
                                    >
                                        <div className="relative mb-3 overflow-hidden">
                                            <div className="aspect-[3/4] rounded-lg overflow-hidden w-[200px]">
                                                <img 
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="hidden md:block space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-[1px] bg-[#8B5E34]"></div>
                                                    <h3 className="text-lg font-light text-[#4A2B0F]">
                                                        {product.title}
                                                    </h3>
                                                </div>
                                                
                                                <p className="text-sm ml-6 text-gray-600 leading-relaxed font-light">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseOurProducts; 