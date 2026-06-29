import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Pencil, FileCheck, CheckCircle, Info, Receipt, HelpCircle, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductTable from '../components/ProductTable';
import InvoicePreview from '../components/InvoicePreview';
import siteBackground from '../assets/site-background.png';
import { calculateSummary, calculateLineTotal, formatCurrency } from '../utils/calculations';
import { downloadInvoiceAsPDF } from '../utils/pdfGenerator';
import { validateInvoice, getInvoiceValidationMessage } from '../utils/validators';
import { invoiceService, productService } from '../services/api';
import { useLocation } from 'react-router-dom';
import { normalizeProductWeight } from '../utils/productFields';

const InvoiceGenerator = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type');
    const docType = typeParam === 'quotation' ? 'QUOTATION' : 'INVOICE';
    const isAromaDew = typeParam === 'aroma_dew';
    const isQuotation = docType === 'QUOTATION';
    const docLabel = isAromaDew ? 'Aroma Dew Invoice' : (isQuotation ? 'Quotation' : 'Invoice');
    const HeadingIcon = isQuotation ? FileCheck : Pencil;
    const introLabel = isAromaDew ? 'Aroma Dew Workspace' : (isQuotation ? 'Quotation Workspace' : 'Invoice Workspace');
    const introText = isAromaDew
        ? 'Prepare a polished Aroma Dew soap invoice with customer details, products, and ready-to-send totals.'
        : isQuotation
            ? 'Prepare a polished quotation with pricing, quantities, and share-ready totals.'
            : 'Prepare a polished invoice with customer details, products, and ready-to-send totals.';
    const primaryActionLabel = isAromaDew ? 'Generate Aroma Dew Invoice' : (isQuotation ? 'Generate Quotation' : 'Generate Invoice');
    const downloadActionLabel = isAromaDew ? 'Download Aroma Dew Invoice' : (isQuotation ? 'Download Official Quotation' : 'Download Official Invoice');
    const resetActionLabel = isAromaDew ? 'Create Another Aroma Dew Invoice' : (isQuotation ? 'Create Another Quotation' : 'Create Another Invoice');
    
    const [isSaving, setIsSaving] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    
    // Initial State
    const [masterProducts, setMasterProducts] = useState([]);
    const [invoice, setInvoice] = useState(() => {
        const saved = localStorage.getItem('pending_invoice');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    ...parsed,
                    docType: docType,
                    businessName: isAromaDew ? 'Aroma Dew' : 'Akshara Enterprises'
                };
            } catch (e) {
                console.error("Error parsing saved invoice", e);
            }
        }
        return {
            businessName: isAromaDew ? 'Aroma Dew' : 'Akshara Enterprises',
            businessAddress: '123 Enterprise Way, Industrial Park, Bangalore, KA, India',
            businessEmail: 'contact@akshara.in',
            businessPhone: '+91 80 4567 8901',
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
    });

    // Persist invoice state to localStorage
    useEffect(() => {
        localStorage.setItem('pending_invoice', JSON.stringify(invoice));
    }, [invoice]);

    // Update docType and businessName when query parameters change
    useEffect(() => {
        setInvoice(prev => ({
            ...prev,
            docType: docType,
            businessName: isAromaDew ? 'Aroma Dew' : 'Akshara Enterprises'
        }));
    }, [docType, isAromaDew]);

    // Load master products on mount
    useEffect(() => {
        const loadMaster = async () => {
             try {
                 const res = await productService.getProducts();
                 setMasterProducts(res.data.map(normalizeProductWeight));
             } catch (error) {
                 console.error("Master products failed to load");
             }
        };
        loadMaster();
    }, []);

    // Update summary when items or fields change
    useEffect(() => {
        const summary = calculateSummary(invoice.items, invoice.gstRate);
        setInvoice(prev => ({ ...prev, ...summary }));
    }, [invoice.items, invoice.gstRate]);

    const handleFieldChange = (field, value) => {
        setInvoice(prev => ({ ...prev, [field]: value }));
    };

    const calculateItemsWithGst = (items, gstRate) =>
        items.map((item) => {
            const normalizedTaxRate = Number(gstRate) || 0;
            const { lineTotal } = calculateLineTotal(
                item.quantity,
                item.unitPrice,
                normalizedTaxRate,
                item.discount
            );

            return {
                ...item,
                tax: normalizedTaxRate,
                lineTotal,
            };
        });

    const handleAddItem = () => {
        const newItem = {
            productName: '',
            brand: '',
            description: '',
            packetWeight: '',
            quantity: 1,
            mrp: 0,
            unitPrice: 0,
            tax: invoice.gstRate || 0,
            discount: 0,
            lineTotal: 0
        };
        setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const handleUpdateItem = (index, field, value) => {
        const newItems = [...invoice.items];
        
        // Handle field updates with proper numeric conversion
        let updatedValue = value;
        if (['unitPrice', 'discount', 'quantity', 'mrp'].includes(field)) {
            updatedValue = Number(value) || 0;
        }

        if (field === 'multi') {
            newItems[index] = { ...newItems[index], ...value };
        } else {
            newItems[index] = { ...newItems[index], [field]: updatedValue };
        }
        
        // Recalculate line total for this specific item using guaranteed numeric values
        const { lineTotal } = calculateLineTotal(
            newItems[index].quantity, 
            newItems[index].unitPrice, 
            invoice.gstRate, 
            newItems[index].discount
        );
        newItems[index].lineTotal = lineTotal;
        newItems[index].tax = Number(invoice.gstRate) || 0;
        
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const handleGstRateChange = (value) => {
        const nextGstRate = Number(value) || 0;
        setInvoice((prev) => ({
            ...prev,
            gstRate: nextGstRate,
            items: calculateItemsWithGst(prev.items, nextGstRate)
        }));
    };

    const handleRemoveItem = (index) => {
        const newItems = invoice.items.filter((_, i) => i !== index);
        setInvoice(prev => ({ ...prev, items: newItems }));
    };

    const handleCreateMasterProduct = async (productData) => {
        try {
            const res = await productService.createProduct(productData);
            const newProduct = normalizeProductWeight(res.data);
            setMasterProducts(prev => [newProduct, ...prev]);
            toast.success(`"${newProduct.name}" added to Master Catalog`, {
                style: { borderRadius: '15px', padding: '16px', background: '#fff', color: '#0f172a' }
            });
            return newProduct;
        } catch (error) {
            console.error("Failed to create product:", error);
            toast.error("Failed to add product to Master Catalog");
        }
    };

    const autoSaveNewProducts = async () => {
        const newProductsToCreate = [];
        
        for (const item of invoice.items) {
            const name = item.productName?.trim();
            if (!name) continue;
            
            // Check if it already exists in masterProducts (case-insensitive)
            const exists = masterProducts.some(p => p.name.toLowerCase() === name.toLowerCase());
            if (!exists) {
                newProductsToCreate.push({
                    name,
                    price: Number(item.unitPrice) || 0,
                    mrp: Number(item.mrp) || 0,
                    packetWeight: item.packetWeight || '',
                    brand: item.brand || '',
                    description: item.description || ''
                });
            }
        }

        if (newProductsToCreate.length === 0) return;

        // Create them all
        const createdProducts = [];
        for (const prod of newProductsToCreate) {
            try {
                const res = await productService.createProduct(prod);
                createdProducts.push(normalizeProductWeight(res.data));
            } catch (error) {
                console.error(`Failed to auto-save product ${prod.name}:`, error);
            }
        }

        if (createdProducts.length > 0) {
            setMasterProducts(prev => [...createdProducts, ...prev]);
            toast.success(`Added ${createdProducts.length} new product(s) to Master Catalog`, {
                style: { borderRadius: '15px', padding: '16px', background: '#fff', color: '#0f172a' }
            });
        }
    };

    const handlePlaceOrder = async () => {
        const { isValid, errors } = validateInvoice(invoice);
        
        if (!isValid) {
            toast.error(getInvoiceValidationMessage(errors), {
                icon: <Info className="text-rose-500" />,
                style: { borderRadius: '15px', padding: '16px', background: '#fff', color: '#0f172a' }
            });
            return;
        }

        setIsSaving(true);
        try {
            // Remove the temporary invoice number string so backend can generate it
            const payload = { ...invoice };
            if (payload.invoiceNumber === 'AUTO-GENERATING...') {
                delete payload.invoiceNumber;
            }

            const response = await invoiceService.createInvoice(payload);
            
            // Update local state with official invoice data (especially the real ID and number)
            setInvoice(prev => ({ 
                ...prev, 
                _id: response.data._id, 
                invoiceNumber: response.data.invoiceNumber 
            }));
            
            setOrderPlaced(true);
            
            toast.success(`${docLabel} created successfully (${response.data.invoiceNumber})`, {
                icon: <CheckCircle className="text-emerald-500" />,
                duration: 4000
            });
            
        } catch (error) {
            console.error("Place Order Error:", error);
            toast.error(error.response?.data?.message || "Failed to place order", {
                icon: <HelpCircle className="text-rose-500" />
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPDF = async () => {
        const { isValid, errors } = validateInvoice(invoice);
        
        if (!isValid) {
            toast.error(getInvoiceValidationMessage(errors), {
                icon: <Info className="text-rose-500" />,
                style: { borderRadius: '15px', padding: '16px', background: '#fff', color: '#0f172a' }
            });
            return;
        }

        // Auto-save new products in the background
        await autoSaveNewProducts();

        const filename = invoice.invoiceNumber && invoice.invoiceNumber !== 'AUTO-GENERATING...'
            ? invoice.invoiceNumber
            : (isAromaDew ? 'aroma-dew-invoice' : (isQuotation ? 'quotation' : 'invoice'));
        downloadInvoiceAsPDF('invoice-preview', filename);
    };

    return (
        <div className="site-shell">
            <Navbar />
            <Toaster position="top-right" />
            
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <div className="mb-12 fade-in">
                    <div
                        className="relative overflow-hidden rounded-[34px] border border-white/25 px-8 py-8 shadow-[0_28px_80px_-36px_rgba(35,4,10,0.95)] backdrop-blur-2xl md:px-12 md:py-10"
                        style={{
                            backgroundColor: 'rgba(117, 10, 19, 0.34)',
                            backgroundImage: `linear-gradient(135deg, rgba(82, 5, 13, 0.2), rgba(255, 255, 255, 0.06)), url(${siteBackground})`,
                            backgroundPosition: 'top left',
                            backgroundRepeat: 'repeat',
                            backgroundSize: '370px 371px',
                        }}
                    >
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-white/10" />
                        <div className="pointer-events-none absolute -top-12 right-10 h-32 w-32 rounded-full bg-white/12 blur-3xl" />
                        <div className="relative">
                            <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-white/90 backdrop-blur-xl">
                                {introLabel}
                            </div>
                            <div className="flex flex-col gap-5 md:flex-row md:items-center">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/14 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl">
                                    <HeadingIcon size={30} />
                                </div>
                                <div>
                                    <h1 className="flex items-center gap-4 text-4xl font-black leading-tight text-white md:text-5xl">
                                        Generate New {docLabel}
                                    </h1>
                                    <p className="mt-3 max-w-2xl text-sm font-black uppercase tracking-[0.18em] text-white/92 md:text-base">
                                        {introText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Single Column Workspace */}
                    <div className="lg:col-span-12 space-y-12 fade-in stagger-1 opacity-100">
                        <div className="mb-2 flex items-center gap-4">
                             <div className="h-px flex-1 bg-white/25" />
                             <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-black font-outfit uppercase tracking-[0.3em] text-rose-50/80 backdrop-blur-xl">
                                 Customer Details
                             </span>
                             <div className="h-px flex-1 bg-white/25" />
                         </div>

                        <div className="space-y-4 rounded-[32px] border border-white/35 bg-[rgba(255,251,251,0.9)] p-8 shadow-[0_28px_70px_-40px_rgba(27,2,7,0.9)] backdrop-blur-2xl">
                            <input 
                                type="text"
                                placeholder="Enter customer name..."
                                    className="h-14 w-full rounded-2xl border border-[#ebdde0] bg-white/72 px-5 text-2xl font-black font-outfit text-[#7E0E16] shadow-none placeholder:text-[#c8aeb4] focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-75"
                                    value={invoice.customerName}
                                    disabled={orderPlaced}
                                    onChange={(e) => handleFieldChange('customerName', e.target.value)}
                                />
                                <textarea 
                                    placeholder="Enter customer address..."
                                    className="h-24 w-full resize-none rounded-2xl border border-[#ebdde0] bg-white/72 px-5 py-4 font-bold text-slate-600 shadow-none placeholder:text-[#c8aeb4] focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-75"
                                    value={invoice.customerAddress}
                                    disabled={orderPlaced}
                                    onChange={(e) => handleFieldChange('customerAddress', e.target.value)}
                                />

                                <div className="grid gap-8 border-t border-[#ecdfe2] pt-6 md:grid-cols-2">
                                    <div className="flex items-center gap-4">
                                         <label className="min-w-[120px] text-[10px] font-black font-outfit uppercase tracking-widest text-[#9d7e86]">Phone Number</label>
                                         <input 
                                             type="text"
                                             className="flex-1 rounded-xl border border-[#ebdde0] bg-white/72 px-4 py-3 text-xs font-black font-outfit text-slate-900 focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 placeholder:text-[#c8aeb4] disabled:opacity-75"
                                             placeholder="Enter Phone..."
                                             value={invoice.customerPhone}
                                             disabled={orderPlaced}
                                             onChange={(e) => handleFieldChange('customerPhone', e.target.value)}
                                         />
                                    </div>
                                    {!isQuotation && (
                                        <div className="flex items-center gap-4">
                                             <label className="min-w-[160px] text-[10px] font-black font-outfit uppercase tracking-widest text-[#9d7e86]">Delivery Challan</label>
                                             <input 
                                                 type="text"
                                                 className="flex-1 rounded-xl border border-[#ebdde0] bg-white/72 px-4 py-3 text-xs font-black font-outfit text-[#7E0E16] focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 placeholder:text-[#c8aeb4] disabled:opacity-75"
                                                 placeholder="Enter Status..."
                                                 value={invoice.challanStatus}
                                                 disabled={orderPlaced}
                                                 onChange={(e) => handleFieldChange('challanStatus', e.target.value)}
                                             />
                                        </div>
                                    )}
                                </div>

                                {/* Note Input */}
                                <div className="flex items-start gap-4 border-t border-[#ecdfe2] pt-6">
                                    <label className="min-w-[120px] pt-3 text-[10px] font-black font-outfit uppercase tracking-widest text-[#9d7e86]">Note</label>
                                    <input
                                        type="text"
                                        className="flex-1 rounded-xl border border-[#ebdde0] bg-white/72 px-4 py-3 text-xs font-black font-outfit text-slate-900 focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 placeholder:text-[#c8aeb4] disabled:opacity-75"
                                        placeholder="Enter note for the invoice..."
                                        value={invoice.note}
                                        disabled={orderPlaced}
                                        onChange={(e) => handleFieldChange('note', e.target.value)}
                                    />
                                </div>
                        </div>

                        <div className="mb-2 flex items-center gap-4">
                             <div className="h-px flex-1 bg-white/25" />
                             <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-black font-outfit uppercase tracking-[0.3em] text-rose-50/80 backdrop-blur-xl">
                                 Products Detail
                             </span>
                             <div className="h-px flex-1 bg-white/25" />
                        </div>
                        
                        <ProductTable 
                            items={invoice.items} 
                            masterProducts={masterProducts}
                            gstRate={invoice.gstRate}
                            onUpdate={handleUpdateItem} 
                            onAdd={handleAddItem} 
                            onRemove={handleRemoveItem} 
                            disabled={orderPlaced}
                            onCreateProduct={handleCreateMasterProduct}
                        />

                        {/* Centered Summary and Actions */}
                        <div className="flex flex-col items-center gap-8 pt-12">
                             <div className="w-full max-w-lg space-y-6 rounded-[32px] border border-white/35 bg-[rgba(255,251,251,0.92)] p-10 shadow-[0_28px_70px_-40px_rgba(27,2,7,0.9)] backdrop-blur-2xl">
                                 <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-[#8d747c]">
                                     <span>Net Subtotal</span>
                                     <span className="text-slate-900">{formatCurrency(invoice.subtotal)}</span>
                                 </div>
                                 <div className="flex items-center justify-between gap-6 text-xs font-black uppercase tracking-widest text-[#7E0E16]">
                                     <div className="flex flex-col gap-3">
                                         <span>Total GST Tax</span>
                                         <select
                                             value={invoice.gstRate || 0}
                                             disabled={orderPlaced}
                                             onChange={(e) => handleGstRateChange(e.target.value)}
                                             className="h-11 w-36 appearance-none rounded-2xl border border-[#e7d8db] bg-white px-4 text-center text-sm font-black text-[#7E0E16] shadow-[0_10px_24px_-18px_rgba(63,4,11,0.8)] outline-none transition-all focus:border-[#7E0E16] focus:ring-2 focus:ring-rose-100 disabled:cursor-not-allowed disabled:bg-white/70 disabled:text-[#b48d94]"
                                         >
                                             <option value="0">0% GST</option>
                                             <option value="5">5% GST</option>
                                             <option value="12">12% GST</option>
                                             <option value="18">18% GST</option>
                                         </select>
                                     </div>
                                     <div className="flex flex-col items-end gap-2">
                                         <span className="rounded-full border border-[#7E0E16]/10 bg-[#7E0E16]/8 px-3 py-1">+{formatCurrency(invoice.totalTax)}</span>
                                         <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b1878f]">
                                             Applied at {invoice.gstRate || 0}%
                                         </span>
                                     </div>
                                 </div>
                                 <div className="h-px bg-[#eadbdd]" />
                                 <div className="flex items-end justify-between">
                                     <div className="flex flex-col">
                                         <span className="mb-1 text-[10px] font-black font-outfit uppercase tracking-widest text-[#8d747c]">
                                             {isQuotation ? 'Final Quotation Amount' : 'Final Payable Amount'}
                                         </span>
                                         <span className="text-4xl font-black font-outfit tabular-nums tracking-tighter text-[#7E0E16]">
                                             {formatCurrency(invoice.grandTotal)}
                                         </span>
                                     </div>
                                 </div>
                             </div>

                             <div className="flex flex-col items-center gap-6 w-full">
                                 <div className="flex flex-col md:flex-row items-center gap-4">
                                     <button 
                                         onClick={handleDownloadPDF}
                                         className="btn rounded-2xl bg-[#7E0E16] px-20 py-5 text-lg text-white shadow-[0_24px_44px_-24px_rgba(63,4,11,0.95)] transition-all hover:scale-105 hover:bg-[#691018] hover:shadow-[0_28px_50px_-24px_rgba(63,4,11,0.98)]"
                                     >
                                         <Download size={24} />
                                         {downloadActionLabel}
                                     </button>
                                     <button 
                                         onClick={() => {
                                             localStorage.removeItem('pending_invoice');
                                             window.location.reload();
                                         }}
                                         className="btn rounded-2xl border border-white/35 bg-white/85 px-10 py-5 font-bold text-slate-700 shadow-[0_18px_36px_-28px_rgba(24,2,6,0.9)] transition-all hover:bg-white hover:scale-105"
                                     >
                                         {resetActionLabel}
                                     </button>
                                 </div>
                             </div>
                        </div>

                        {/* Live Outlook Section for PDF Generation */}
                        <div className="pt-24 opacity-100">
                             <div className="mb-8 flex items-center gap-4">
                                  <div className="h-px flex-1 bg-white/25" />
                                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-black font-outfit uppercase tracking-[0.3em] text-rose-50/80 backdrop-blur-xl">
                                      Live {docLabel} Preview
                                  </span>
                                  <div className="h-px flex-1 bg-white/25" />
                             </div>
                             <div className="mx-auto max-w-[1020px] rounded-[32px] border border-white/35 bg-[rgba(255,251,251,0.9)] p-4 shadow-[0_28px_70px_-40px_rgba(27,2,7,0.9)] backdrop-blur-2xl">
                                 <div className="overflow-hidden rounded-2xl border border-[#eadbdd] bg-white shadow-2xl">
                                     <InvoicePreview invoice={invoice} />
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default InvoiceGenerator;
