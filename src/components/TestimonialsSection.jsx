import React from 'react';

const testimonials = [
    {
        content: "Les produits KANUURA ont transformé ma peau. Je suis ravie de leur efficacité et de leur douceur.",
        author: "Fatou Ndiaye",
        username: "@fatou",
        avatar: "https://i.pravatar.cc/150?u=fatou.ndiaye"
    },
    {
        content: "Je recommande vivement ! Des produits naturels de qualité qui respectent la peau.",
        author: "Mamadou Diop",
        username: "@mamadou",
        avatar: "https://i.pravatar.cc/150?u=mamadou.diop"
    },
    {
        content: "Les soins pour le visage sont incroyables. Ma peau est plus lumineuse que jamais.",
        author: "Awa Ba",
        username: "@awa",
        avatar: "https://i.pravatar.cc/150?u=awa.ba"
    }
];

const TestimonialsSection = () => {
    return (
        <section className="relative flex flex-col items-start justify-center w-full overflow-hidden py-12 sm:py-20 px-3 sm:px-4 md:px-10 lg:px-20">
            <div className="flex flex-col items-start justify-center text-left gap-4 sm:gap-6 mb-6 sm:mb-8 mx-2 sm:ml-6">
                <div className="w-16 sm:w-20 h-[2px] bg-primary/30 mb-1 sm:mb-2"></div>
                <span className="text-primary font-medium tracking-wider uppercase text-xs sm:text-sm">
                    Témoignages
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 max-w-2xl leading-tight">
                    Ce que nos clients pensent
                    <span className="font-extralight text-lg sm:text-xl md:text-2xl mt-1 sm:mt-2 block text-gray-500">
                        Des retours d'expérience authentiques
                    </span>
                </h2>
            </div>

            <div className="w-full">
                <div className="group flex overflow-hidden p-1 sm:p-2 [--duration:40s] [--gap:0.5rem] sm:[--gap:1rem] [gap:var(--gap)] flex-row">
                    {[...Array(4)].map((_, groupIndex) => (
                        <div 
                            key={groupIndex}
                            className="flex shrink-0 justify-start [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
                        >
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={`${groupIndex}-${index}`} 
                                    className="flex flex-col items-start space-y-3 sm:space-y-4 px-2 sm:px-4"
                                >
                                    <div className="shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white hover:bg-gray-50 transition-all duration-300 max-w-[280px] sm:max-w-sm border border-gray-100 hover:scale-[1.02] hover:shadow-2xl">
                                        <div className="flex flex-col">
                                            <div className="flex items-center mb-3 sm:mb-4">
                                                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-primary/10">
                                                    <img 
                                                        src={testimonial.avatar} 
                                                        alt={testimonial.author}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </span>
                                                <div className="ml-2 sm:ml-3">
                                                    <p className="text-gray-900 font-medium text-xs sm:text-sm">{testimonial.author}</p>
                                                    <p className="text-[10px] sm:text-xs text-primary/70">{testimonial.username}</p>
                                                </div>
                                            </div>
                                            <div className="mb-2 sm:mb-3">
                                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                                                </svg>
                                            </div>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic">
                                                {testimonial.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient overlays */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-1/4 bg-gradient-to-r from-white to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-1/4 bg-gradient-to-l from-white to-transparent"></div>
        </section>
    );
};

export default TestimonialsSection; 