import React from 'react';
import { Marquee } from './Marquee';

// Ajout du tableau logos
const logos = [
  {
    name: "coupe capillaire",
    img: "/854.png",
  },
  {
    name: "soin visage",
    img: "/dcgd.png",
  },
  {
    name: "soin visage 2",
    img: "/dmks.png",
  },
  {
    name: "produitkanuura1",
    img: "/frfr.png",
  },
  {
    name: "multi-service",
    img: "/jsnja.png",
  },
  {
    name: "soin visage 3",
    img: "/sachet_7.png",
  },
];

const Hero = () => {
    return (
        <div className="hero h-auto flex flex-col md:flex-row mt-5 pt-40 lg:ml-8">
            <div className="flex-1 flex items-center justify-start pl-1 md:pl-8">
                <div className="text-left text-[#4A2B0F] p-5">
                    <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-alexBrush" style={{ fontWeight: 400, fontSize: '78px', lineHeight: '48px' }}>
                        Découvrez nos produits naturels
                    </h1>
                    <p className="mt-4 text-base md:text-xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '28px', color: '#4A2B0F' }}>
                        Des soins capillaires naturels pour sublimer votre beauté. Fabriqués avec des ingrédients biologiques sélectionnés avec soin.
                    </p>
                    <div className="mt-6 flex space-x-4">
                        <button className="px-4 py-2 bg-[#4a2b0f] text-white rounded-[10px] hover:bg-[#755e49] transition duration-300" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '24px' }}>
                            Nos produits
                        </button>
                        <button className="px-4 py-2 border border-[#4a2b0f] bg-[#4a2b0f] bg-opacity-20 text-[#4a2b0f] rounded-[10px]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '24px' }}>
                            En savoir plus
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex-1 md:w-1/2 h-[410px] flex justify-center items-center hidden md:flex">
                <div className="relative flex h-full w-full md:w-96 flex-col items-center justify-center gap-4 overflow-hidden px-5 md:px-20">
                    <div className="flex flex-row gap-4 [perspective:300px]">
                        <Marquee
                            className="h-96 justify-center overflow-hidden [--duration:60s] [--gap:1rem]"
                            vertical
                            style={{
                                transform: "translateX(0px) translateY(0px) translateZ(-50px) rotateX(0deg) rotateY(-20deg) rotateZ(10deg) scale(1.5)",
                            }}
                        >
                            {logos.map((data, idx) => (
                                <img
                                    key={idx}
                                    src={data.img}
                                    alt={data.name}
                                    className="mx-auto h-full w-3/4 cursor-pointer rounded-xl border-transparent transition-all duration-300"
                                />
                            ))}
                        </Marquee>
                    </div>
                    {/* Suppression des arrière-plans visibles */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero; 