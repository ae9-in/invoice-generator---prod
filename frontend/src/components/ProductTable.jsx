import { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, Info, ChevronDown, Package } from 'lucide-react';
import { calculateLineTotal } from '../utils/calculations';
import { getPacketWeightValue } from '../utils/productFields';

const ProductTable = ({ items, masterProducts = [], gstRate = 0, onUpdate, onAdd, onRemove, disabled = false, onCreateProduct }) => {
    const [openPicker, setOpenPicker] = useState(null); // Track which row index has picker open
    const pickerRefs = useRef({});

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openPicker !== null && pickerRefs.current[openPicker] && !pickerRefs.current[openPicker].contains(event.target)) {
                setOpenPicker(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openPicker]);

    const handleSelectProduct = (index, product) => {
        // We use a dedicated batch update to prevent state race-conditions
        onUpdate(index, 'multi', {
            productName: product.name,
            unitPrice: product.price,
            mrp: product.mrp || 0,
            brand: product.brand,
            packetWeight: getPacketWeightValue(product)
        });
        setOpenPicker(null);
    };

    const handleAddNewProduct = async (index, name) => {
        if (!name || !name.trim()) return;
        const item = items[index];
        const productData = {
            name: name.trim(),
            price: Number(item.unitPrice) || 0,
            mrp: Number(item.mrp) || 0,
            packetWeight: item.packetWeight || '',
            brand: item.brand || '',
            description: ''
        };
        if (onCreateProduct) {
            const created = await onCreateProduct(productData);
            if (created) {
                onUpdate(index, 'multi', {
                    productName: created.name,
                    unitPrice: created.price,
                    mrp: created.mrp || 0,
                    brand: created.brand,
                    packetWeight: getPacketWeightValue(created)
                });
            }
        }
        setOpenPicker(null);
    };

    return (
        <div className="mt-10 overflow-hidden rounded-[32px] border border-white/35 bg-[rgba(255,251,251,0.92)] shadow-[0_28px_70px_-40px_rgba(27,2,7,0.9)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-[#eadbdd] bg-[rgba(255,244,245,0.82)] px-8 py-4 group">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7E0E16]/10 bg-[#7E0E16]/8 text-[#7E0E16] transition-all duration-300 group-hover:bg-[#7E0E16] group-hover:text-white">
                        <Plus size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-outfit text-slate-900 leading-tight block">Product Details</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9d7e86]">GST is selected in the final summary card</p>
                    </div>
                </div>
                <button 
                  type="button"
                  onClick={onAdd}
                  disabled={disabled}
                  className="btn border border-[#7E0E16]/15 bg-[#7E0E16] px-4 py-2 text-sm text-white shadow-[0_18px_36px_-24px_rgba(63,4,11,0.95)] hover:bg-[#691018] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus size={16} className="mr-2" />
                    Add Item
                </button>
            </div>
            
            <div className={`overflow-x-auto w-full ${items.length > 0 ? 'min-h-[400px]' : ''}`}>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#efe2e4] bg-[rgba(255,248,248,0.78)] text-[10px] font-black uppercase tracking-[0.15em] text-[#7e6770] font-outfit">
                            <th className="px-8 py-5 w-[32%] text-left">Product Name</th>
                            <th className="px-4 py-5 w-[14%] text-center">Weight</th>
                            <th className="px-4 py-5 w-[8%] text-center">Qty</th>
                            <th className="px-4 py-5 w-[12%] text-center">MRP</th>
                            <th className="px-4 py-5 w-[12%] text-center">Rate</th>
                            <th className="px-8 py-5 w-[18%] text-right font-black">Total (Without GST)</th>
                            <th className="px-4 py-5 w-[60px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#efe2e4]">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-20">
                                    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-[#eadbdd] py-16 text-center">
                                        <div className="rounded-full bg-[rgba(255,244,245,0.9)] p-6 text-[#caaab0]">
                                            <Info size={48} />
                                        </div>
                                        <div>
                                            <p className="block font-outfit text-lg font-bold leading-tight text-slate-900">No Products Added Yet</p>
                                            <p className="text-sm text-[#9d7e86]">Add your first product to start calculating the total.</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={onAdd}
                                            disabled={disabled}
                                            className="btn mt-2 border border-[#7E0E16]/10 bg-[#7E0E16] px-6 text-white shadow-[0_18px_36px_-24px_rgba(63,4,11,0.95)] hover:bg-[#691018] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Plus size={16} className="mr-2" />
                                            Add First Product
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item, index) => {
                            const { lineTotal } = calculateLineTotal(item.quantity, item.unitPrice, 0, item.discount || 0);
                            return (
                                <tr key={index} className="group min-h-[5rem] transition-all duration-200 hover:bg-[rgba(255,242,244,0.85)]">
                                    <td className="px-8 py-5 relative" ref={el => pickerRefs.current[index] = el}>
                                        <div className="relative flex items-center">
                                            <div className="flex-1 min-w-0">
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter Product Name..."
                                                    className="w-full border-none bg-transparent pr-10 text-lg font-bold text-slate-900 placeholder:text-[#c8aeb4] focus:ring-0 disabled:opacity-75"
                                                    value={item.productName}
                                                    disabled={disabled}
                                                    onChange={(e) => onUpdate(index, 'productName', e.target.value)}
                                                    onFocus={() => !disabled && setOpenPicker(index)}
                                                />
                                                {item.brand && (
                                                    <p className="-mt-1 mb-1 pl-3 text-[10px] font-black uppercase tracking-widest text-[#7E0E16]">
                                                        {item.brand}
                                                    </p>
                                                )}
                                            </div>
                                            <button 
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => setOpenPicker(openPicker === index ? null : index)}
                                                className={`rounded-lg p-2 transition-all ${openPicker === index ? 'bg-[#fff1f2] text-[#7E0E16]' : 'text-slate-300 hover:text-[#7E0E16]'} disabled:opacity-0`}
                                            >
                                                <ChevronDown size={20} className={`transform transition-transform ${openPicker === index ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Custom Product Picker Window */}
                                        {openPicker === index && (
                                            <div className="absolute top-full left-8 right-8 z-[200] mt-2 overflow-hidden rounded-2xl border border-[#eadbdd] bg-white/95 py-2 shadow-2xl backdrop-blur-xl fade-in animate-in slide-in-from-top-2 duration-200">
                                                <div className="mb-2 border-b border-[#f1e5e7] px-4 py-2">
                                                     <p className="text-[10px] font-black uppercase tracking-widest text-[#9d7e86]">Master Catalog List</p>
                                                </div>
                                                <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                                                    {/* Add to Master Catalog Option */}
                                                    {item.productName.trim() && !masterProducts.some(p => p.name.toLowerCase() === item.productName.trim().toLowerCase()) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddNewProduct(index, item.productName)}
                                                            className="group/item flex w-full items-center justify-between px-5 py-3 text-left border-b border-[#f1e5e7] bg-emerald-50/40 hover:bg-emerald-50 transition-colors duration-200"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors duration-200">
                                                                    <Plus size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-emerald-700 text-sm">Add "{item.productName.trim()}" to Master Catalog</p>
                                                                    <p className="text-[10px] text-emerald-600/80 font-semibold uppercase tracking-wider">Creates item with current rate & weight</p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )}

                                                    {(masterProducts.filter(p => p.name.toLowerCase().includes(item.productName.toLowerCase())).length > 0) ? (
                                                        masterProducts
                                                            .filter(p => p.name.toLowerCase().includes(item.productName.toLowerCase()))
                                                            .map((p, i) => (
                                                                <button
                                                                    key={i}
                                                                    type="button"
                                                                    onClick={() => handleSelectProduct(index, p)}
                                                                    className="group/item flex w-full items-center justify-between px-5 py-3 text-left hover:bg-[rgba(255,244,245,0.8)]"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-400 group-hover/item:bg-[#fff1f2] group-hover/item:text-[#7E0E16]">
                                                                            <Package size={14} />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#7E0E16]">{p.brand || 'No Brand'}</p>
                                                                            <p className="text-[10px] font-bold text-slate-400">{getPacketWeightValue(p) || 'No weight added'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="font-black text-emerald-600 text-sm font-outfit">
                                                                        ₹{p.price.toLocaleString()}
                                                                    </span>
                                                                </button>
                                                            ))
                                                    ) : (
                                                        <div className="px-5 py-8 text-center">
                                                            <p className="text-xs text-slate-400 italic">No matching products found.</p>
                                                            <p className="text-[10px] text-slate-300 mt-1 uppercase font-bold tracking-widest leading-relaxed">
                                                                {masterProducts.length > 0 ? "Try a different search" : "Register items in PRODUCTS first"}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 500g"
                                            className="h-10 w-full rounded-xl border border-[#ebdde0] bg-white/72 px-3 text-center text-xs font-bold text-slate-700 shadow-none focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-75"
                                            value={item.packetWeight}
                                            disabled={disabled}
                                            onChange={(e) => onUpdate(index, 'packetWeight', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <input 
                                            type="number" 
                                            className="h-10 w-full rounded-xl border border-[#ebdde0] bg-white/72 px-3 text-center font-bold text-slate-700 shadow-none focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-75"
                                            value={item.quantity}
                                            disabled={disabled}
                                            onChange={(e) => onUpdate(index, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <input 
                                            type="number" 
                                            className="h-10 w-full rounded-xl border border-[#ebdde0] bg-white/72 px-3 text-center font-bold text-slate-700 shadow-none focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-75"
                                            value={item.mrp}
                                            disabled={disabled}
                                            onChange={(e) => onUpdate(index, 'mrp', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <input 
                                            type="number" 
                                            className="h-10 w-full rounded-xl border border-[#ebdde0] bg-white/72 px-3 text-center font-bold text-slate-700 shadow-none focus:border-[#7E0E16] focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-75"
                                            value={item.unitPrice}
                                            disabled={disabled}
                                            onChange={(e) => onUpdate(index, 'unitPrice', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-8 py-5 text-right text-xl font-black font-outfit text-[#7E0E16]">
                                        {lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-5 text-right">
                                        {!disabled && (
                                            <button 
                                                type="button"
                                                onClick={() => onRemove(index)}
                                                className="p-2 text-slate-300 transition-all duration-300 hover:text-rose-500"
                                            >
                                                <Trash2 size={24} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductTable;
