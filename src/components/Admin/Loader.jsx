import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                <div className="relative flex items-center justify-center">
                    {/* Cercle extérieur */}
                    <div className="w-20 h-20 border-4 border-[#8B5E34]/20 rounded-full animate-spin-slow">
                        <div className="w-full h-full rounded-full border-4 border-t-[#8B5E34] border-r-transparent border-b-transparent border-l-transparent"></div>
                    </div>
                    
                    {/* Cercle du milieu */}
                    <div className="absolute w-14 h-14 border-4 border-[#8B5E34]/30 rounded-full animate-spin-reverse">
                        <div className="w-full h-full rounded-full border-4 border-t-[#8B5E34] border-r-transparent border-b-transparent border-l-transparent"></div>
                    </div>
                    
                    {/* Cercle intérieur */}
                    <div className="absolute w-8 h-8 border-4 border-[#8B5E34]/40 rounded-full animate-spin-fast">
                        <div className="w-full h-full rounded-full border-4 border-t-[#8B5E34] border-r-transparent border-b-transparent border-l-transparent"></div>
                    </div>

                    {/* Point central */}
                    <div className="absolute w-2 h-2 bg-[#8B5E34] rounded-full"></div>
                </div>
                
                {/* Texte de chargement */}
                <div className="mt-6 text-center">
                    <p className="text-white font-medium text-lg">Chargement</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader; 