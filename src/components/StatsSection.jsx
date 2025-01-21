import React from 'react';

const StatsSection = () => {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20">
                    <div className="w-20 h-[2px] bg-primary/30 mb-6"></div>
                    <span className="text-primary font-medium tracking-wider uppercase text-sm mb-3 block">
                        En chiffres
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light text-gray-900 max-w-2xl leading-tight">
                        L'impact de notre engagement
                        <span className="font-extralight text-xl md:text-2xl mt-2 block text-gray-500">
                            Des résultats concrets qui témoignent de votre confiance
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="group relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="relative">
                                    <span className="block text-5xl font-light tracking-tight text-gray-900">500<span className="text-primary">+</span></span>
                                    <div className="h-[1px] w-12 bg-primary/30 my-4"></div>
                                </div>
                                <span className="text-gray-500 font-light">Utilisateurs satisfaits</span>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                        <circle cx="8" cy="21" r="1"></circle>
                                        <circle cx="19" cy="21" r="1"></circle>
                                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="relative">
                                    <span className="block text-5xl font-light tracking-tight text-gray-900">150<span className="text-primary">+</span></span>
                                    <div className="h-[1px] w-12 bg-primary/30 my-4"></div>
                                </div>
                                <span className="text-gray-500 font-light">Commandes livrées</span>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative flex items-start space-x-6">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="relative">
                                    <span className="block text-5xl font-light tracking-tight text-gray-900">4.8</span>
                                    <div className="h-[1px] w-12 bg-primary/30 my-4"></div>
                                </div>
                                <span className="text-gray-500 font-light">Note moyenne</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection; 