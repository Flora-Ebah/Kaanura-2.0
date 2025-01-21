import React from 'react';
import Header from './../components/Header';
import Footer from './../components/Footer';
import Hero from '../components/Hero';
import Product from '../components/Product';
import WhyChooseOurProducts from '../components/WhyChooseOurProducts';
import WellnessSection from '../components/WellnessSection';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQ from '../components/FAQ'; // Assurez-vous que le chemin est correct
import ContactUs from '../components/ContactUs';

const Home = () => {
    return (
        <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
            <Header />
            <Hero />
            <Product />
            <WhyChooseOurProducts />
            <WellnessSection />
            <StatsSection />
            <TestimonialsSection />
            <FAQ />
            <ContactUs />
            <Footer />
        </div>
    );
};

export default Home; 