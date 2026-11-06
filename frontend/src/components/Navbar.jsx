import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AddInvoiceModal from './AddInvoiceModal';

const Navbar = () => {
    const { user, isAdmin } = useAuth();
    const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);

    return (
        <>
            <nav
                className="fixed top-0 w-full z-[100] overflow-hidden border-b border-white/12 glass py-4"
            >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/6" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-white/6 to-transparent" />
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="bg-[#7E0E16] p-2 rounded-xl text-white">
                            <FileText size={24} />
                        </div>
                        <div>
                            <span className="text-xl font-bold font-outfit text-white leading-tight block">Akshara</span>
                            <span className="text-[10px] font-semibold text-white uppercase tracking-widest block -mt-1">Enterprises</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden md:flex items-center gap-7">
                            <Link to="/" className="text-sm font-bold text-white hover:text-white transition-colors uppercase tracking-widest font-outfit">Home</Link>
                            <Link to="/saved" className="text-sm font-bold text-white hover:text-white transition-colors uppercase tracking-widest font-outfit">Orders</Link>
                            {isAdmin && (
                                <Link to="/products" className="text-sm font-bold text-white hover:text-white transition-colors uppercase tracking-widest font-outfit">Products</Link>
                            )}
                        </div>

                        {/* ADD INVOICE CARD */}
                        <button
                            type="button"
                            onClick={() => setIsAddInvoiceOpen(true)}
                            className="group flex items-center gap-2 rounded-2xl border border-white/35 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-4 py-2 text-stone-950 font-black text-xs uppercase tracking-wider font-outfit shadow-[0_10px_24px_-6px_rgba(251,191,36,0.6)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_14px_30px_-6px_rgba(251,191,36,0.85)] active:scale-95"
                            title="Create new brand invoice"
                        >
                            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-stone-950 text-amber-300 transition-transform duration-300 group-hover:rotate-90">
                                <Plus size={13} strokeWidth={3} />
                            </div>
                            <span className="leading-none">+ Add Invoice</span>
                        </button>

                        <div className="hidden md:block h-6 w-px bg-white/18" />

                        <div className="hidden sm:flex items-center gap-4">
                            <div className="flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-white/90 backdrop-blur-md">
                                <ShieldCheck size={16} />
                                <div className="text-right">
                                    <p className="text-xs font-black text-white font-outfit leading-none">{user?.name}</p>
                                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/88">
                                        Direct Access Enabled
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Quick Add Invoice Modal */}
            <AddInvoiceModal
                isOpen={isAddInvoiceOpen}
                onClose={() => setIsAddInvoiceOpen(false)}
            />
        </>
    );
};

export default Navbar;
