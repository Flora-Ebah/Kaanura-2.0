import React, { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique d'envoi du formulaire
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section className="py-24 bg-gradient-to-b from-[#FDFBF7] to-white relative overflow-hidden" id="contact">
            {/* Éléments décoratifs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#ad8d6e]/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4a2b0f]/5 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20">
                        {/* Colonne de gauche - Informations */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-1.5 bg-[#ad8d6e]/20 rounded-full">
                                    <span className="text-sm text-[#8B5E34] font-medium tracking-wider uppercase">
                                        Contactez-nous
                                    </span>
                                </div>
                                <h2 className="text-4xl font-light text-[#4A2B0F] max-w-xl leading-tight">
                                    Parlons de votre projet beauté
                                </h2>
                                <p className="text-gray-600 leading-relaxed max-w-lg">
                                    Notre équipe d'experts est là pour répondre à toutes vos questions et vous accompagner dans votre routine de soins personnalisée.
                                </p>
                            </div>

                            {/* Informations de contact */}
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ad8d6e]/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#8B5E34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-[#4A2B0F]">Email</p>
                                        <a href="mailto:contact@example.com" className="text-gray-600 hover:text-[#8B5E34] transition-colors">
                                            contact@example.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ad8d6e]/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#8B5E34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-[#4A2B0F]">Téléphone</p>
                                        <a href="tel:+33123456789" className="text-gray-600 hover:text-[#8B5E34] transition-colors">
                                            +33 1 23 45 67 89
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Colonne de droite - Formulaire */}
                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-[0_0_50px_0_rgba(0,0,0,0.05)] p-8 lg:p-12">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-[#4A2B0F]">
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8B5E34] focus:ring-[#8B5E34] focus:ring-1 transition-colors duration-200 bg-gray-50/50"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-[#4A2B0F]">
                                                Adresse email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8B5E34] focus:ring-[#8B5E34] focus:ring-1 transition-colors duration-200 bg-gray-50/50"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-[#4A2B0F]">
                                                Sujet
                                            </label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8B5E34] focus:ring-[#8B5E34] focus:ring-1 transition-colors duration-200 bg-gray-50/50"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-[#4A2B0F]">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8B5E34] focus:ring-[#8B5E34] focus:ring-1 transition-colors duration-200 bg-gray-50/50 resize-none"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#4A2B0F] text-white py-4 px-8 rounded-lg hover:bg-[#8B5E34] transition-colors duration-300 font-medium"
                                    >
                                        Envoyer le message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs; 