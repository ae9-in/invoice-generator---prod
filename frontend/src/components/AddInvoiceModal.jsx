import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Building2, MapPin, Phone, Mail, FileText, ArrowRight, Sparkles, LayoutGrid } from 'lucide-react';
import { brandService } from '../services/api';
import { toast } from 'react-hot-toast';

const DEFAULT_ADDRESS = `BHIVE Platinum, 48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka- 560001`;
const DEFAULT_PHONE = `9731185960`;
const DEFAULT_EMAIL = `contact@akshara.in`;

const BRAND_PRESETS = [
    {
        name: 'Akshara Enterprises',
        address: DEFAULT_ADDRESS,
        phone: DEFAULT_PHONE,
        email: DEFAULT_EMAIL,
        type: 'INVOICE'
    },
    {
        name: 'Aroma Dew',
        address: DEFAULT_ADDRESS,
        phone: DEFAULT_PHONE,
        email: DEFAULT_EMAIL,
        type: 'INVOICE'
    }
];

const AddInvoiceModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const [brandName, setBrandName] = useState('');
    const [brandAddress, setBrandAddress] = useState(DEFAULT_ADDRESS);
    const [brandPhone, setBrandPhone] = useState(DEFAULT_PHONE);
    const [brandEmail, setBrandEmail] = useState(DEFAULT_EMAIL);
    const [docType, setDocType] = useState('INVOICE');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSelectPreset = (preset) => {
        setBrandName(preset.name);
        setBrandAddress(preset.address);
        setBrandPhone(preset.phone);
        setBrandEmail(preset.email);
        setDocType(preset.type);
    };

    const handleSaveBrandCard = async (openImmediately = false) => {
        const finalBrandName = brandName.trim();
        if (!finalBrandName) {
            toast.error("Please enter a Brand Name");
            return;
        }

        const finalAddress = brandAddress.trim() || DEFAULT_ADDRESS;
        const finalPhone = brandPhone.trim() || DEFAULT_PHONE;
        const finalEmail = brandEmail.trim() || DEFAULT_EMAIL;

        setIsSubmitting(true);

        const newBrandData = {
            id: 'custom_' + Date.now(),
            name: finalBrandName,
            displayName: finalBrandName,
            description: `Generate professional invoices specifically for ${finalBrandName} products.`,
            address: finalAddress,
            phone: finalPhone,
            email: finalEmail,
            docType: docType,
            color: 'blue'
        };

        // 1. Save to local storage for instant availability
        try {
            const existingRaw = localStorage.getItem('custom_brand_cards');
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            const filtered = existing.filter(b => b.name.toLowerCase() !== finalBrandName.toLowerCase());
            filtered.unshift(newBrandData);
            localStorage.setItem('custom_brand_cards', JSON.stringify(filtered));
        } catch (e) {
            console.error("Local storage error:", e);
        }

        // 2. Save to backend API (async without blocking)
        try {
            await brandService.createBrand({
                name: finalBrandName,
                displayName: finalBrandName,
                description: `Generate professional invoices specifically for ${finalBrandName} products.`,
                address: finalAddress,
                phone: finalPhone,
                email: finalEmail,
                docType: docType
            });
        } catch (err) {
            console.warn("Backend save notice:", err?.response?.data?.message || err.message);
        }

        // 3. Dispatch global event so QuickActions on Home page immediately adds the card
        window.dispatchEvent(new CustomEvent('brand_cards_updated', { detail: newBrandData }));

        toast.success(`New "${finalBrandName}" invoice card generated!`, {
            style: { borderRadius: '15px', padding: '16px', background: '#fff', color: '#0f172a' }
        });

        setIsSubmitting(false);
        onClose();

        if (openImmediately) {
            const newDraft = {
                businessName: finalBrandName,
                businessAddress: finalAddress,
                businessPhone: finalPhone,
                businessEmail: finalEmail,
                customerName: '',
                customerAddress: '',
                customerEmail: '',
                customerPhone: '',
                invoiceNumber: 'AUTO-GENERATING...',
                invoiceDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'Pending',
                challanStatus: '',
                gstRate: 0,
                items: [],
                subtotal: 0,
                totalTax: 0,
                totalDiscount: 0,
                grandTotal: 0,
                note: '',
                docType: docType
            };
            localStorage.setItem('pending_invoice', JSON.stringify(newDraft));

            const typeParam = docType === 'QUOTATION' 
                ? 'quotation' 
                : (finalBrandName.toLowerCase().includes('aroma') ? 'aroma_dew' : 'invoice');

            const destination = `/generator?type=${typeParam}&brand=${encodeURIComponent(finalBrandName)}&address=${encodeURIComponent(finalAddress)}&phone=${encodeURIComponent(finalPhone)}`;
            
            if (window.location.pathname === '/generator') {
                window.location.href = destination;
            } else {
                navigate(destination);
            }
        } else {
            if (window.location.pathname !== '/') {
                navigate('/');
            }
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 py-10">
            {/* Clickable Backdrop overlay */}
            <div 
                className="fixed inset-0 -z-10"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div 
                className="relative my-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/30 bg-white p-6 sm:p-8 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.65)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7E0E16] text-white shadow-md">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black font-outfit text-slate-900 leading-tight">
                                Generate New Brand Invoice Card
                            </h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-outfit mt-0.5">
                                Creates a new card in the Home section
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    {/* Brand Presets */}
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 font-outfit">
                            Quick Suggestions Or Custom Brand
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {BRAND_PRESETS.map((p) => {
                                const isSelected = brandName === p.name;
                                return (
                                    <button
                                        key={p.name}
                                        type="button"
                                        onClick={() => handleSelectPreset(p)}
                                        className={`rounded-xl px-4 py-2 text-xs font-black font-outfit uppercase tracking-wider transition-all duration-200 ${
                                            isSelected 
                                                ? 'bg-[#7E0E16] text-white shadow-md shadow-[#7E0E16]/30' 
                                                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                                        }`}
                                    >
                                        {p.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Brand Name Input */}
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1 font-outfit">
                            Brand Name (For New Card) *
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Building2 size={16} />
                            </div>
                            <input
                                type="text"
                                required
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                placeholder="Enter Brand Name (e.g. Pooja Works, Mysore Sandal, Akshara...)"
                                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-black font-outfit text-[#7E0E16] placeholder:text-slate-400 focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100"
                            />
                        </div>
                    </div>

                    {/* Document Type Selector */}
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5 font-outfit">
                            Document Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setDocType('INVOICE')}
                                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black font-outfit uppercase tracking-wider transition-all ${
                                    docType === 'INVOICE'
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white'
                                }`}
                            >
                                <FileText size={14} />
                                Tax Invoice
                            </button>
                            <button
                                type="button"
                                onClick={() => setDocType('QUOTATION')}
                                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black font-outfit uppercase tracking-wider transition-all ${
                                    docType === 'QUOTATION'
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white'
                                }`}
                            >
                                <FileText size={14} />
                                Quotation
                            </button>
                        </div>
                    </div>

                    {/* Brand Address Input */}
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1 font-outfit">
                            Brand / Company Address *
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute top-3 left-3.5 text-slate-400">
                                <MapPin size={16} />
                            </div>
                            <textarea
                                required
                                rows={2}
                                value={brandAddress}
                                onChange={(e) => setBrandAddress(e.target.value)}
                                placeholder="Enter address to appear on bill header..."
                                className="w-full resize-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100"
                            />
                        </div>
                    </div>

                    {/* Phone & Email Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1 font-outfit">
                                Contact Phone
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Phone size={14} />
                                </div>
                                <input
                                    type="text"
                                    value={brandPhone}
                                    onChange={(e) => setBrandPhone(e.target.value)}
                                    placeholder="Phone number..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1 font-outfit">
                                Contact Email
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Mail size={14} />
                                </div>
                                <input
                                    type="email"
                                    value={brandEmail}
                                    onChange={(e) => setBrandEmail(e.target.value)}
                                    placeholder="Email address..."
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleSaveBrandCard(false)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-black font-outfit uppercase tracking-wider text-slate-800 shadow-sm transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <LayoutGrid size={15} />
                            <span>Add Card To Home Grid</span>
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleSaveBrandCard(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#7E0E16] px-6 py-2.5 text-xs font-black font-outfit uppercase tracking-wider text-white shadow-lg shadow-[#7E0E16]/30 transition-all hover:bg-[#680b12] hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <span>Generate & Open Invoice</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default AddInvoiceModal;
