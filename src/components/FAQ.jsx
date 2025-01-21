import React, { useState } from 'react';

const faqItems = [
    {
        id: 1,
        question: "Quels sont vos principaux produits cosmétiques ?",
        answer: "Nous proposons une gamme complète de produits de soins naturels."
    },
    {
        id: 2,
        question: "Quels ingrédients sont utilisés dans vos produits et d'où proviennent-ils ?",
        answer: "Nos ingrédients sont 100% naturels et sourcés localement."
    },
    {
        id: 3,
        question: "Comment garantissez-vous que vos produits sont respectueux de l'environnement ?",
        answer: "Nous suivons des pratiques écologiques strictes dans notre production."
    },
    {
        id: 4,
        question: "Quelles sont les innovations récentes dans vos produits ?",
        answer: "Nous intégrons constamment les dernières avancées en cosmétique naturelle."
    },
    {
        id: 5,
        question: "Quels sont vos engagements en matière de responsabilité sociale d'entreprise (RSE) ?",
        answer: "Notre entreprise s'engage fortement dans le développement durable."
    }
];

const FAQ = () => {
    const [openItem, setOpenItem] = useState(null);

    const toggleItem = (id) => {
        setOpenItem(openItem === id ? null : id);
    };

    return (
        <section className="py-20 sm:py-32 relative overflow-hidden">
            {/* Arrière-plan décoratif */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f8f9ff,transparent)] dark:bg-[radial-gradient(circle_at_top_right,#1a1f35,transparent)]" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-3xl">
                    {/* En-tête avec style moderne */}
                    <div className="mb-16">
                        <div className="inline-block px-4 py-1.5 bg-[#ad8d6e] dark:bg-[#4a2b0f]/30 rounded-full mb-4">
                            <p className="text-sm text-[#8B5E34] font-medium tracking-wider uppercase text-sm">
                                Support & Aide
                            </p>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-light text-[#4A2B0F] max-w-2xl leading-tight">
                            Questions Fréquentes
                        </h2>
                    </div>

                    {/* Liste des FAQ avec nouveau design */}
                    <div className="space-y-4">
                        {faqItems.map((item) => (
                            <div 
                                key={item.id}
                                className="group border-b border-gray-200 dark:border-gray-700 last:border-0"
                            >
                                <button 
                                    onClick={() => toggleItem(item.id)}
                                    className="w-full py-6 flex items-center justify-between gap-4 group-hover:text-[#4a2b0f] dark:group-hover:text-[#ad8d6e] transition-colors duration-200 text-left"
                                >
                                    <span className="text-xl font-medium">
                                        {item.question}
                                    </span>
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-[#4a2b0f] dark:group-hover:border-[#ad8d6e] transition-all duration-200 ${
                                        openItem === item.id ? 'bg-[#4a2b0f] dark:bg-[#ad8d6e] border-[#4a2b0f] dark:border-[#ad8d6e]' : ''
                                    }`}>
                                        <svg 
                                            className={`w-4 h-4 transition-all duration-200 ${
                                                openItem === item.id 
                                                    ? 'transform rotate-180 text-white' 
                                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-[#4a2b0f] dark:group-hover:text-[#ad8d6e]'
                                            }`}
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d={openItem === item.id ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                                            />
                                        </svg>
                                    </span>
                                </button>
                                
                                <div className={`grid transition-all duration-300 ease-in-out ${
                                    openItem === item.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}>
                                    <div className="overflow-hidden">
                                        <div className="pb-6 pr-12 text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Section de contact supplémentaire */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Vous ne trouvez pas la réponse que vous cherchez ?{' '}
                            <a href="#contact" className="text-[#4a2b0f] dark:text-[#ad8d6e] hover:text-[#4a2b0f] font-medium">
                                Contactez notre équipe →
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ; 