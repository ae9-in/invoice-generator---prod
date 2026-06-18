import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, Search, Filter, History, HelpCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import InvoiceList from '../components/InvoiceList';
import { invoiceService } from '../services/api';
import { downloadInvoiceAsPDF, printInvoice } from '../utils/pdfGenerator';

const SavedInvoices = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        status: 'All'
    });

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.search) {
                // Determine if searching for customer name or invoice number
                if (filters.search.startsWith('INV-')) {
                    params.invoiceNumber = filters.search;
                } else {
                    params.customerName = filters.search;
                }
            }
            if (filters.status !== 'All') {
                params.status = filters.status;
            }

            const response = await invoiceService.getInvoices(params);
            setInvoices(response.data);
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to load invoice history", {
                icon: <HelpCircle className="text-rose-500" />
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [filters]);

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    const handleFilter = (status) => {
        setFilters(prev => ({ ...prev, status }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this invoice permanently?")) return;
        
        try {
            await invoiceService.deleteInvoice(id);
            toast.success("Invoice successfully removed!", {
                icon: <PlusCircle className="text-emerald-500 rotate-45" />
            });
            fetchInvoices();
        } catch (error) {
            toast.error("Error deleting invoice");
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await invoiceService.updateInvoice(id, { status });
            toast.success(`Order marked as ${status}!`, {
                icon: <CheckCircle className="text-emerald-500" />
            });
            fetchInvoices();
        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    const handlePrintLocal = async (id) => {
        try {
           const response = await invoiceService.getInvoiceById(id);
           // Logic to render and then print (usually handled via a printable page or temporary hidden element)
           // For simplicity, we navigate to details where they can print, or use the hidden element approach
           navigate(`/invoices/${id}`);
        } catch (error) {
           toast.error("Could not fetch invoice details for printing");
        }
    }

    const handleDownloadLocal = async (id) => {
        try {
           const response = await invoiceService.getInvoiceById(id);
           // We might need to render this hiddenly if not on page, 
           // but easiest is redirect or open single view
           navigate(`/invoices/${id}`);
        } catch (error) {
           toast.error("Could not fetch invoice details for PDF");
        }
    }

    return (
        <div className="site-shell">
            <Navbar />
            <Toaster position="top-right" />
            
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 fade-in">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 leading-tight flex items-center gap-4">
                            <History className="text-indigo-600" size={36} />
                            {isAdmin ? 'Orders Dashboard' : 'My Orders Center'}
                        </h1>
                        <p className="text-lg text-slate-500 font-semibold mt-2 font-outfit uppercase tracking-widest block opacity-70">
                            {isAdmin ? 'Company Oversight Terminal' : 'Personal Billing Activity'} for <span className="text-blue-600">Akshara Enterprises</span>
                        </p>
                    </div>
                </div>

                <SearchBar 
                    onSearch={handleSearch} 
                    onFilter={handleFilter} 
                    filters={filters} 
                />

                <div className="fade-in stagger-1 opacity-100">
                    {loading ? (
                        <div className="py-32 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                            <p className="font-bold text-slate-500 font-outfit uppercase tracking-widest text-sm">Fetching Data...</p>
                        </div>
                    ) : (
                        <InvoiceList 
                            invoices={invoices} 
                            onDelete={handleDelete} 
                            onPrint={handlePrintLocal}
                            onDownload={handleDownloadLocal}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SavedInvoices;
