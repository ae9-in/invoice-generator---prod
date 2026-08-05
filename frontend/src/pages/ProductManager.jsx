import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/api';
import { toast, Toaster } from 'react-hot-toast';
import { ShoppingBag, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import siteBackground from '../assets/site-background.png';
import { getPacketWeightValue, normalizeProductWeight } from '../utils/productFields';

const ProductManager = () => {
    const { isAdmin } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', packetWeight: '', category: '', brand: '', description: '' });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getProducts();
            setProducts(response.data.map(normalizeProductWeight));
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = (product = null) => {
        if (product) {
            const normalizedProduct = normalizeProductWeight(product);
            setEditingProduct(product);
            setFormData({
                name: normalizedProduct.name,
                price: normalizedProduct.price,
                packetWeight: normalizedProduct.packetWeight,
                category: normalizedProduct.category || '',
                brand: normalizedProduct.brand || '',
                description: normalizedProduct.description || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', packetWeight: '', category: '', brand: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const trimmedPacketWeight = formData.packetWeight.trim();
            const payload = {
                ...formData,
                packetWeight: trimmedPacketWeight,
                category: trimmedPacketWeight,
            };
            if (editingProduct) {
                await productService.updateProduct(editingProduct._id, payload);
                toast.success("Product updated successfully");
            } else {
                await productService.createProduct(payload);
                toast.success("Product added to catalog");
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product from master catalog? (Note: This will only remove it from future billing, it will still show in old invoices)")) return;
        try {
            await productService.deleteProduct(id);
            toast.success("Product removed");
            fetchProducts();
        } catch (error) {
            toast.error("Error deleting product");
        }
    };

    return (
        <div className="site-shell">
            <Navbar />
            <Toaster position="top-right" />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <div className="mb-12 fade-in">
                    <div
                        className="relative overflow-hidden rounded-[34px] border border-white/25 p-8 shadow-[0_28px_80px_-36px_rgba(35,4,10,0.95)] backdrop-blur-2xl md:p-10"
                        style={{
                            backgroundColor: 'rgba(117, 10, 19, 0.34)',
                            backgroundImage: `linear-gradient(135deg, rgba(82, 5, 13, 0.18), rgba(255, 255, 255, 0.06)), url(${siteBackground})`,
                            backgroundPosition: 'top left',
                            backgroundRepeat: 'repeat',
                            backgroundSize: '370px 371px',
                        }}
                    >
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-white/10" />
                        <div className="pointer-events-none absolute -top-12 right-10 h-32 w-32 rounded-full bg-white/12 blur-3xl" />
                        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100/25 bg-emerald-400/10 text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
                                    <ShoppingBag size={30} />
                                </div>
                                <h1 className="text-4xl font-black font-outfit leading-tight text-white md:text-5xl">
                                    Product Catalog
                                </h1>
                                <p className="mt-3 text-sm font-black font-outfit uppercase tracking-[0.22em] text-rose-50/80 md:text-base">
                                    Master Inventory for <span className="text-white">Akshara Enterprises</span>
                                </p>
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="btn self-start rounded-2xl border border-white/25 bg-white/14 px-8 py-4 text-lg text-white shadow-[0_22px_45px_-26px_rgba(20,2,6,0.9)] backdrop-blur-xl hover:bg-[#7E0E16] hover:shadow-[0_26px_52px_-26px_rgba(63,4,11,0.95)] md:self-center"
                                >
                                    <Plus className="mr-2" />
                                    Add Master Product
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="fade-in stagger-1 overflow-hidden rounded-[32px] border border-white/35 bg-[rgba(255,251,251,0.9)] shadow-[0_30px_80px_-42px_rgba(28,3,8,0.95)] backdrop-blur-2xl opacity-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#eadbdd] bg-[rgba(255,244,245,0.82)] text-[10px] font-black uppercase tracking-[0.15em] text-[#7e6770] font-outfit">
                                    <th className="px-8 py-6">Product Item</th>
                                    <th className="px-6 py-6 text-center">Brand</th>
                                    <th className="px-6 py-6 text-center">Net Weight</th>
                                    <th className="px-6 py-6">Standard Price</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#efe2e4]">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center">
                                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#7E0E16]/10 border-t-[#7E0E16]" />
                                        </td>
                                    </tr>
                                ) : products.length > 0 ? (
                                    products.map((p) => (
                                        <tr key={p._id} className="group transition-all duration-200 hover:bg-[rgba(255,242,244,0.85)]">
                                            <td className="px-8 py-6 font-black text-[#7E0E16]">
                                                {p.name}
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className="rounded-lg border border-[#7E0E16]/10 bg-[#7E0E16]/8 px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-[#7E0E16]">
                                                    {p.brand || 'NO BRAND'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className="rounded-lg border border-[#e8dadd] bg-white/70 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600">
                                                    {getPacketWeightValue(p) || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 font-black text-emerald-600 text-xl font-outfit">
                                                ₹{p.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {isAdmin ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(p)}
                                                            className="rounded-xl border border-[#e9dfe1] bg-white/75 p-3 text-slate-400 transition-all duration-300 hover:bg-[#fff1f2] hover:text-[#7E0E16]"
                                                        >
                                                            <Edit2 size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(p._id)}
                                                            className="rounded-xl border border-[#e9dfe1] bg-white/75 p-3 text-slate-400 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Read Only</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-32 text-center text-sm font-outfit uppercase tracking-widest text-[#b58f97]">
                                            The catalog is empty
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#22050a]/60 p-6 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 shadow-2xl fade-in">
                        <div className="flex items-center justify-between border-b border-slate-100 p-8 bg-slate-50/50">
                            <h3 className="text-2xl font-black font-outfit text-slate-900">
                                {editingProduct ? 'Update Master Product' : 'Register New Product'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 bg-white rounded-full p-1 hover:bg-slate-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="label">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field h-12 font-bold text-slate-900"
                                    placeholder="e.g. Premium Basmati Rice"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Standard Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field h-12 font-black text-slate-900"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Net Weight (ml,kg,gm,L)</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field h-12 font-black text-slate-900"
                                        placeholder="e.g. 500g, 1L"
                                        value={formData.packetWeight}
                                        onChange={(e) => setFormData({ ...formData, packetWeight: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Brand (Select or Type New)</label>
                                <input
                                    list="brands"
                                    className="input-field h-12 font-black text-slate-900"
                                    required
                                    placeholder="Choose or type brand..."
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                                <datalist id="brands">
                                    <option value="AROMA DEW" />
                                    <option value="JAYA JANARDHANA" />
                                    <option value="SRR" />
                                    <option value="MILLETS PRO" />
                                </datalist>
                            </div>

                            <button type="submit" className="btn w-full bg-[#7E0E16] py-4 text-lg text-white shadow-[0_8px_30px_rgb(126,14,22,0.2)] hover:bg-[#691018] hover:shadow-[0_8px_30px_rgb(126,14,22,0.3)] transition-all mt-2">
                                <Check className="mr-2" />
                                {editingProduct ? 'Save Master Changes' : 'Add to Catalog'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProductManager;
