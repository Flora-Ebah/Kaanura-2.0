import React, { useState } from 'react';
import { FacebookOutlined, InstagramOutlined, WhatsAppOutlined } from '@ant-design/icons';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique d'inscription à la newsletter
    };

    return (
        <footer className="bg-[#4A2B0F] relative overflow-hidden">
            {/* Éléments décoratifs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B5E34]/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#ad8d6e]/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>

            <div className="container mx-auto px-4 py-16 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Logo et Description */}
                    <div className="space-y-6">
                        <img 
                            src="logo.png" 
                            alt="Kanuura Logo" 
                            className="h-12"
                        />
                        <p className="text-[#ad8d6e] font-light" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '22px', color: '#FFFFFF' }}>
                            La source du bien-être
                        </p>
                        <div className="flex space-x-4">
                            {/* Icônes de réseaux sociaux */}
                            <a
                                href="https://facebook.com"
                                className="w-10 h-10 rounded-full bg-[#ad8d6e]/20 flex items-center justify-center group transition-colors duration-300 hover:bg-[#ad8d6e]"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FacebookOutlined className="text-[#ad8d6e] group-hover:text-white transition-colors duration-300" />
                            </a>
                            <a
                                href="https://instagram.com"
                                className="w-10 h-10 rounded-full bg-[#ad8d6e]/20 flex items-center justify-center group transition-colors duration-300 hover:bg-[#ad8d6e]"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <InstagramOutlined className="text-[#ad8d6e] group-hover:text-white transition-colors duration-300" />
                            </a>
                            <a
                                href="https://whatsapp.com"
                                className="w-10 h-10 rounded-full bg-[#ad8d6e]/20 flex items-center justify-center group transition-colors duration-300 hover:bg-[#ad8d6e]"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <WhatsAppOutlined className="text-[#ad8d6e] group-hover:text-white transition-colors duration-300" />
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="font-light" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '22px', color: '#FFFFFF' }}>Contact</h4>
                        <ul className="space-y-4 text-[#ad8d6e]/90">
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-[#ad8d6e] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Yoff Virage Dakar Sénégal</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-[#ad8d6e] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div className="space-y-1">
                                    <p>+221 77 648 93 87</p>
                                    <p>+221 77 541 81 51</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Liens rapides */}
                    <div className="space-y-6">
                        <h4 className="font-light" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '22px', color: '#FFFFFF' }}>Liens rapides</h4>
                        <ul className="space-y-4">
                            {['À propos', 'Produits', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a 
                                        href={`#${item.toLowerCase()}`}
                                        className="text-[#ad8d6e]/90 hover:text-[#ad8d6e] transition-colors duration-300"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h4 className="font-light" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '22px', color: '#FFFFFF' }}>Newsletter</h4>
                        <p className="text-[#ad8d6e]/90">
                            Restez informé de nos dernières actualités et offres exclusives.
                        </p>
                        <form onSubmit={handleSubmit} className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Votre email"
                                className="w-full px-4 py-3 rounded-lg bg-[#ad8d6e]/10 border border-[#ad8d6e]/20 text-white placeholder-[#ad8d6e]/50 focus:outline-none focus:border-[#ad8d6e] transition-colors duration-300"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 px-4 py-1.5 bg-[#ad8d6e] text-white rounded-md hover:bg-[#8B5E34] transition-colors duration-300"
                            >
                                OK
                            </button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-16 pt-8 border-t border-[#ad8d6e]/20">
                    <p className="text-center text-[#ad8d6e]/70 text-sm">
                        © {new Date().getFullYear()} KANUURA. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 