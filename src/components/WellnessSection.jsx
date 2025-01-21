import React from 'react';

const WellnessSection = () => {
    return (
        <div className="relative overflow-hidden">
            <div className="pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-40 lg:pb-48">
                <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                    <div className="sm:max-w-lg">
                        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight sm:text-7xl font-alexBrush" style={{ fontWeight: 400, lineHeight: '48px' }}>
                            Votre Bien-Être, Notre Priorité Absolue
                        </h1>
                        <p className="mt-4 text-xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '18px', lineHeight: '28px', color: '#4A2B0F' }}>
                            Chez KANUURA, nous plaçons votre satisfaction au cœur de nos engagements avec des solutions naturelles et adaptées à vos besoins.
                        </p>
                    </div>
                    <div>
                        <div className="mt-10">
                            <div aria-hidden="true" className="hidden md:block pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                    <div className="flex items-center space-x-6 lg:space-x-8">
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100 hidden md:block">
                                                <img src="/njn.png" alt="Image grille 1" className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100 hidden md:block">
                                                <img src="/tesshirt.png" alt="Image grille 2" className="h-full w-full object-cover object-center" />
                                            </div>
                                        </div>
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <img src="/Sac.png" alt="Image grille 3" className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <img src="/5-1.png" alt="Image grille 4" className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <img src="/sachet_7.png" alt="Image grille 5" className="h-full w-full object-cover object-center" />
                                            </div>
                                        </div>
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <img src="/jnjj.png" alt="Image grille 6" className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <img src="/jsnja.png" alt="Image grille 7" className="h-full w-full object-cover object-center" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium opacity-disabled pointer-events-none [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover bg-foreground text-white" data-disabled="true" type="button" disabled="">
                                    En savoir plus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellnessSection; 