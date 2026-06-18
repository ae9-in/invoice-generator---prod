import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { ChevronLeft, Printer, Download, Trash2, Eye, Receipt, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InvoicePreview from '../components/InvoicePreview';
import { invoiceService } from '../services/api';
import { downloadInvoiceAsPDF, printInvoice } from '../utils/pdfGenerator';

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await invoiceService.getInvoiceById(id);
                setInvoice(response.data);
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error("Could not find this invoice record", {
                    icon: <HelpCircle className="text-rose-500" />
                });
                setTimeout(() => navigate('/saved'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id, navigate]);

    const handlePrint = () => {
        printInvoice('invoice-preview');
    };

    const handleDownload = () => {
        downloadInvoiceAsPDF('invoice-preview', invoice.invoiceNumber);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        try {
            await invoiceService.deleteInvoice(id);
            toast.success("Invoice deleted successfully");
            navigate('/saved');
        } catch (error) {
            toast.error("Error deleting invoice");
        }
    };

    if (loading) {
        return (
            <div className="site-shell flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                    <p className="font-bold text-slate-500 font-outfit uppercase tracking-widest text-sm">Fetching Document...</p>
                </div>
            </div>
        );
    }

    if (!invoice) return null;

    return (
        <div className="site-shell">
            <Navbar />
            <Toaster position="top-right" />
            
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 fade-in">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/saved')}
                            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 leading-tight flex items-center gap-4">
                                <Receipt className="text-blue-600" size={36} />
                                {invoice.invoiceNumber}
                            </h1>
                            <p className="text-sm font-bold text-slate-400 font-outfit uppercase tracking-widest mt-1 block opacity-80">
                                Detailed Document View
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-8 md:mt-0">
                        <button 
                            onClick={handlePrint}
                            className="btn btn-secondary px-6"
                        >
                            <Printer size={18} className="mr-2" />
                            Print
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="btn btn-secondary px-6"
                        >
                            <Download size={18} className="mr-2" />
                            Download
                        </button>
                        {isAdmin && (
                            <button 
                                onClick={handleDelete}
                                className="btn btn-danger px-6"
                            >
                                <Trash2 size={18} className="mr-2" />
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                   <div className="lg:col-span-12 xl:col-span-10 xl:col-start-1 fade-in stagger-1 opacity-100 pb-20 overflow-x-auto">
                        <div className="min-w-[800px] xl:min-w-full">
                            <InvoicePreview invoice={invoice} />
                        </div>
                   </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default InvoiceDetails;
