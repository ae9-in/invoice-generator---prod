import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import banner1 from '../assets/banner-1.jpg';
import banner2 from '../assets/banner-2.jpg';
import banner3 from '../assets/banner-3.jpg';
import invoiceCardPreview from '../assets/invoice-card-preview.svg';
import quotationCardPreview from '../assets/quotation-card-preview.svg';
import aromaDewBanner from '../assets/aroma-dew-banner.jpg';

const productsPreviewImages = [banner1, banner2, banner3];

const colorClasses = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    violet: 'bg-violet-50 border-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
};

const imageFrameClasses = {
    blue: 'border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(233,241,255,0.52))]',
    emerald: 'border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(232,249,241,0.52))]',
    violet: 'border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(244,238,255,0.52))]',
};

const ActionCard = ({ icon: Icon, title, description, to, color, imageSrc, imageAlt }) => {
    const isArray = Array.isArray(imageSrc);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!isArray || imageSrc.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % imageSrc.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isArray, imageSrc]);

    return (
        <Link to={to} className="group flex-1">
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(255,255,255,0.58))] p-8 shadow-[0_28px_70px_-42px_rgba(33,4,9,0.95),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/50 hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(255,255,255,0.68))] hover:shadow-[0_34px_82px_-42px_rgba(33,4,9,0.98),inset_0_1px_0_rgba(255,255,255,0.82)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/55 to-transparent" />
                <div className="pointer-events-none absolute -right-10 top-6 h-32 w-32 rounded-full bg-white/28 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />
                <div className="pointer-events-none absolute -left-8 bottom-10 h-28 w-28 rounded-full bg-rose-100/20 blur-3xl" />

                <div className="relative">
                {imageSrc ? (
                    <div className={`mb-8 overflow-hidden rounded-[1.75rem] border shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_35px_-28px_rgba(20,2,6,0.75)] backdrop-blur-xl ${imageFrameClasses[color]}`}>
                        <div className="flex transition-transform duration-700 ease-in-out h-32" style={isArray ? { transform: `translateX(-${currentIndex * 100}%)` } : {}}>
                            {isArray ? (
                                imageSrc.map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt={`${imageAlt} ${i+1}`}
                                        className="h-32 w-full object-cover object-center flex-shrink-0 transition-transform duration-700 group-hover:scale-105"
                                    />
                                ))
                            ) : (
                                <img
                                    src={imageSrc}
                                    alt={imageAlt}
                                    className="h-32 w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${colorClasses[color]}`}>
                        <Icon size={32} />
                    </div>
                )}
                
                <h3 className="text-2xl font-black font-outfit text-slate-900 leading-tight block mb-4 uppercase tracking-tight">
                    {title}
                </h3>
                <p className="mb-8 max-w-[240px] font-medium leading-relaxed text-black">
                    {description}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-black font-outfit uppercase tracking-widest text-black transition-all duration-300 group-hover:gap-4 group-hover:text-black">
                    Get Started
                    <ArrowRight size={18} />
                </div>
                
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-white/35 blur-2xl transition-colors group-hover:bg-white/55" />
                </div>
            </div>
        </Link>
    );
};

const QuickActions = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 -mt-10 mb-24 relative z-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <ActionCard 
                    title="PRODUCTS"
                    description="Manage your product inventory, set prices, and organize your catalog."
                    to="/products"
                    color="emerald"
                    imageSrc={productsPreviewImages}
                    imageAlt="SRR Pooja Works products"
                />
                <ActionCard 
                    title="Bill & Invoice"
                    description="Generate professional invoices, tax reports, and client billing in seconds."
                    to="/generator?type=invoice"
                    color="blue"
                    imageSrc={invoiceCardPreview}
                    imageAlt="Red invoice banner preview"
                />
                <ActionCard 
                    title="Aroma Dew Soap Invoice"
                    description="Generate professional invoices specifically for Aroma Dew soap products."
                    to="/generator?type=aroma_dew"
                    color="blue"
                    imageSrc={aromaDewBanner}
                    imageAlt="Aroma Dew soap invoice banner preview"
                />
                <ActionCard 
                    title="Quotation"
                    description="Create detailed price estimates and official business quotes for your clients."
                    to="/generator?type=quotation" 
                    color="violet"
                    imageSrc={quotationCardPreview}
                    imageAlt="Red quotation banner preview"
                />
            </div>
        </section>
    );
};

export default QuickActions;
