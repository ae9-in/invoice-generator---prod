import { Eye, Trash2, Printer, Download, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '../utils/calculations';
import { useAuth } from '../context/AuthContext';

const InvoiceList = ({ invoices, onDelete, onPrint, onDownload, onUpdateStatus }) => {
    const { isAdmin } = useAuth();
    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.15em] font-black text-slate-500 font-outfit border-b border-slate-100">
                            <th className="px-8 py-5">Invoice #</th>
                            <th className="px-6 py-5">Customer Details</th>
                            <th className="px-6 py-5">Date / Due</th>
                            <th className="px-6 py-5">Total Amount</th>
                            {isAdmin && <th className="px-6 py-5">Created By</th>}
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5">Challan Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.map((invoice) => (
                            <tr key={invoice._id} className="group hover:bg-slate-50/80 transition-all duration-200">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold font-outfit text-xs group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            {invoice.invoiceNumber.split('-')[1]}
                                        </div>
                                        <div>
                                            <span className="font-black text-slate-900 font-outfit tracking-tight block">{invoice.invoiceNumber}</span>
                                            {invoice.businessName && (
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                                    {invoice.businessName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="font-bold text-slate-900 font-outfit mb-0.5">{invoice.customerName}</p>
                                    <p className="text-xs text-slate-500 font-medium">{invoice.customerEmail}</p>
                                </td>
                                <td className="px-6 py-5 text-sm font-semibold">
                                    <p className="text-slate-900">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                                    <p className="text-rose-500 text-[10px] mt-0.5">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-lg font-black font-outfit text-blue-600">{formatCurrency(invoice.grandTotal)}</span>
                                </td>
                                {isAdmin && (
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {invoice.userName || 'System'}
                                        </span>
                                    </td>
                                )}
                                <td className="px-6 py-5">
                                    <StatusBadge status={invoice.status} />
                                </td>
                                <td className="px-6 py-5">
                                     <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest block truncate max-w-[150px]" title={invoice.challanStatus}>
                                         {invoice.challanStatus || 'No Status'}
                                     </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link 
                                            to={`/invoices/${invoice._id}`}
                                            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        
                                        {isAdmin && invoice.status !== 'Paid' && (
                                            <button 
                                                onClick={() => onUpdateStatus(invoice._id, 'Paid')}
                                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-105 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1"
                                                title="Mark as Done"
                                            >
                                                <CheckCircle size={14} />
                                                Done
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => onPrint(invoice._id)}
                                            className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
                                            title="Print"
                                        >
                                            <Printer size={18} />
                                        </button>
                                        <button 
                                          onClick={() => onDownload(invoice._id)}
                                          className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
                                          title="Download PDF"
                                        >
                                            <Download size={18} />
                                        </button>
                                        {isAdmin && (
                                            <button 
                                                onClick={() => onDelete(invoice._id)}
                                                className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 transform hover:scale-110 ml-2"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceList;
