import { ArrowRight, Plus, Trash2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import banner1 from '../assets/banner-1.jpg';
import banner2 from '../assets/banner-2.jpg';
import banner3 from '../assets/banner-3.jpg';
import invoiceCardPreview from '../assets/invoice-card-preview.svg';
import quotationCardPreview from '../assets/quotation-card-preview.svg';
import aromaDewBanner from '../assets/aroma-dew-banner.jpg';
import { brandService } from '../services/api';
import AddInvoiceModal from './AddInvoiceModal';
import { toast } from 'react-hot-toast';

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

const ActionCard = ({ 
    icon: Icon, 
    title, 
    description, 
    to, 
    color = 'blue', 
    imageSrc, 
    imageAlt, 
    brandBannerText, 
    onDelete, 
    isCustom = false 
}) => {
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
        <div className="relative group flex-1">
            {/* Delete button for custom cards */}
            {isCustom && onDelete && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                    }}
                    title="Remove this brand card"
                    className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white/90 hover:bg-rose-600 hover:text-white transition-all backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-md"
                >
                    <Trash2 size={14} />
                </button>
            )}

            <Link to={to} className="block h-full">
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(255,255,255,0.58))] p-8 shadow-[0_28px_70px_-42px_rgba(33,4,9,0.95),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/50 hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(255,255,255,0.68))] hover:shadow-[0_34px_82px_-42px_rgba(33,4,9,0.98),inset_0_1px_0_rgba(255,255,255,0.82)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/55 to-transparent" />
                    <div className="pointer-events-none absolute -right-10 top-6 h-32 w-32 rounded-full bg-white/28 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />
                    <div className="pointer-events-none absolute -left-8 bottom-10 h-28 w-28 rounded-full bg-rose-100/20 blur-3xl" />

                    <div className="relative">
                        {/* Custom Brand Banner */}
                        {brandBannerText ? (
                            <div className="mb-8 overflow-hidden rounded-[1.75rem] border border-[#E8BDC0]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_35px_-28px_rgba(20,2,6,0.75)] backdrop-blur-xl">
                                <div className="relative h-32 w-full rounded-[1.75rem] overflow-hidden bg-gradient-to-r from-[#7E0E16] via-[#9E131D] to-[#7C0D15] flex items-center justify-center px-4">
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
                                    <div className="border border-[#E8BDC0]/75 rounded-md px-5 py-2.5 bg-black/15 backdrop-blur-sm text-center max-w-[90%] shadow-sm">
                                        <span className="font-serif text-[#FFF7F0] tracking-widest text-sm sm:text-base font-black uppercase drop-shadow block truncate">
                                            {brandBannerText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : imageSrc ? (
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
        </div>
    );
};

const QuickActions = () => {
    const [customBrands, setCustomBrands] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const loadBrands = async () => {
        // First load from localStorage for zero latency
        try {
            const raw = localStorage.getItem('custom_brand_cards');
            if (raw) {
                setCustomBrands(JSON.parse(raw));
            }
        } catch (e) {
            console.error("Local load error:", e);
        }

        // Then sync with backend API
        try {
            const res = await brandService.getBrands();
            if (Array.isArray(res.data) && res.data.length > 0) {
                setCustomBrands(res.data);
                localStorage.setItem('custom_brand_cards', JSON.stringify(res.data));
            }
        } catch (err) {
            // Backend offline or error; localStorage serves as cache
        }
    };

    useEffect(() => {
        loadBrands();

        const handleUpdate = () => {
            loadBrands();
        };

        window.addEventListener('brand_cards_updated', handleUpdate);
        return () => window.removeEventListener('brand_cards_updated', handleUpdate);
    }, []);

    const handleDeleteBrand = async (brand) => {
        if (!window.confirm(`Are you sure you want to remove the "${brand.name}" invoice card?`)) return;

        // Remove from local storage
        try {
            const raw = localStorage.getItem('custom_brand_cards');
            const list = raw ? JSON.parse(raw) : [];
            const updated = list.filter(b => (b._id ? b._id !== brand._id : b.name !== brand.name));
            localStorage.setItem('custom_brand_cards', JSON.stringify(updated));
            setCustomBrands(updated);
        } catch (e) {
            console.error("Error removing from local storage:", e);
        }

        // Remove from backend if has id
        if (brand._id) {
            try {
                await brandService.deleteBrand(brand._id);
            } catch (err) {
                console.warn("Backend delete notice:", err.message);
            }
        }

        toast.success(`Removed "${brand.name}" card`);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 -mt-10 mb-24 relative z-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 1. PRODUCTS */}
                <ActionCard 
                    title="PRODUCTS"
                    description="Manage your product inventory, set prices, and organize your catalog."
                    to="/products"
                    color="emerald"
                    imageSrc={productsPreviewImages}
                    imageAlt="SRR Pooja Works products"
                />

                {/* 2. BILL & INVOICE */}
                <ActionCard 
                    title="Bill & Invoice"
                    description="Generate professional invoices, tax reports, and client billing in seconds."
                    to="/generator?type=invoice&brand=Akshara%20Enterprises"
                    color="blue"
                    imageSrc={invoiceCardPreview}
                    imageAlt="Red invoice banner preview"
                />

                {/* 3. AROMA DEW SOAP INVOICE */}
                <ActionCard 
                    title="Aroma Dew Soap Invoice"
                    description="Generate professional invoices specifically for Aroma Dew soap products."
                    to="/generator?type=aroma_dew&brand=Aroma%20Dew"
                    color="blue"
                    imageSrc={aromaDewBanner}
                    imageAlt="Aroma Dew soap invoice banner preview"
                />

                {/* 4. QUOTATION */}
                <ActionCard 
                    title="Quotation"
                    description="Create detailed price estimates and official business quotes for your clients."
                    to="/generator?type=quotation" 
                    color="violet"
                    imageSrc={quotationCardPreview}
                    imageAlt="Red quotation banner preview"
                />

                {/* 5. DYNAMIC CUSTOM BRAND CARDS */}
                {customBrands.map((brand) => {
                    const brandUrl = `/generator?type=${brand.docType === 'QUOTATION' ? 'quotation' : 'invoice'}&brand=${encodeURIComponent(brand.name)}&address=${encodeURIComponent(brand.address || '')}&phone=${encodeURIComponent(brand.phone || '')}`;
                    return (
                        <ActionCard
                            key={brand._id || brand.id || brand.name}
                            title={`${brand.displayName || brand.name} INVOICE`}
                            description={brand.description || `Generate professional invoices specifically for ${brand.name} products.`}
                            to={brandUrl}
                            color={brand.color || 'blue'}
                            brandBannerText={brand.name}
                            isCustom={true}
                            onDelete={() => handleDeleteBrand(brand)}
                        />
                    );
                })}

                {/* 6. ADD BRAND CARD TILE */}
                <div 
                    onClick={() => setIsAddModalOpen(true)}
                    className="group flex-1 min-h-[360px] rounded-[2rem] border-2 border-dashed border-white/45 bg-white/10 hover:bg-white/20 p-8 shadow-[0_28px_70px_-42px_rgba(33,4,9,0.9)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center text-center cursor-pointer"
                >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-stone-950 shadow-lg shadow-amber-400/25 group-hover:scale-110 transition-transform mb-5">
                        <Plus size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black font-outfit text-white uppercase tracking-tight mb-2">
                        + Add Brand Card
                    </h3>
                    <p className="text-xs font-bold text-white/85 max-w-[220px] leading-relaxed mb-6 font-outfit">
                        Generate a new brand invoice card here on your dashboard.
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/20 border border-white/30 px-4 py-2 text-xs font-black uppercase tracking-wider text-white group-hover:bg-white group-hover:text-stone-900 transition-colors">
                        <Sparkles size={14} />
                        <span>Create Card</span>
                    </div>
                </div>
            </div>

            {/* Modal for Creating Brand Card */}
            <AddInvoiceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </section>
    );
};

export default QuickActions;
