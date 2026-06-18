import StatusBadge from './StatusBadge';

const InvoicePreview = ({ invoice }) => {
    // Fill up to 12 rows for that "Bill Book" feel
    const displayItems = [...(invoice.items || [])];
    const effectiveGstRate = Number(
        invoice.gstRate ??
        invoice.items?.find((item) => item?.tax !== undefined)?.tax ??
        0
    ) || 0;
    while (displayItems.length < 10) {
        displayItems.push({ productName: '', packetWeight: '', quantity: '', unitPrice: '', lineTotal: '' });
    }

    return (
        <div id="invoice-preview" className="bg-white p-4 shadow-2xl min-h-[1020px] font-sans text-black relative">
            <div className="mb-2 text-gray-400 font-black text-xs tracking-[0.5em] uppercase">{invoice.docType || 'INVOICE'}</div>
            
            {/* Header Boxed Section */}
            <div className="border-2 border-black flex flex-row" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex-1 bg-white p-8 flex items-center justify-center border-r-2 border-black">
                    <h1 className="text-4xl font-black font-outfit tracking-tight text-center">AKSHARA ENTERPRISES</h1>
                </div>
                <div className="w-[300px] bg-blue-50 p-4 text-[11px] font-bold leading-tight space-y-1">
                    <p>BHIVE Platinum</p>
                    <p>48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka - 560001</p>
                    <p>Contact: 9731105968</p>
                </div>
            </div>

            {/* Recipient Section */}
            <div className="border-2 border-black border-t-0 p-4 min-h-[100px]" style={{ pageBreakInside: 'avoid' }}>
                <div className="text-[12px] font-bold mb-1">To:</div>
                <div className="pl-4">
                    <p className="text-xl font-black uppercase">{invoice.customerName || '_________________________'}</p>
                    <p className="text-sm font-bold text-slate-700 max-w-md mt-1 italic">{invoice.customerAddress || '____________________________________________________'}</p>
                    {invoice.customerPhone && <p className="text-xs font-black mt-2 text-blue-600">PH: {invoice.customerPhone}</p>}
                </div>
            </div>

            {/* Note Section */}
            <div className="border-2 border-black border-t-0 px-4" style={{ pageBreakInside: 'avoid' }}>
                {/* 2-line top gap */}
                <div className="h-5"></div>
                <div className="flex items-baseline gap-2">
                    <span
                        className="text-xs shrink-0"
                        style={{ fontWeight: 700, fontFamily: 'inherit' }}
                    >
                        Note:
                    </span>
                    <span
                        className="flex-1 border-b border-black text-xs pb-0.5"
                        style={{ fontWeight: 400, minWidth: 0 }}
                    >
                        {invoice.note || ''}
                    </span>
                </div>
                {/* 2-line bottom gap */}
                <div className="h-5"></div>
            </div>

            {/* Product Table Grid */}
            <div className="border-2 border-black border-t-0" style={{ pageBreakInside: 'avoid' }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black text-[12px] font-black uppercase tracking-wider text-center">
                            <th className="border-r-2 border-black py-3 w-[8%] italic">SL.No</th>
                            <th className="border-r-2 border-black py-3 w-[45%] text-left px-4">Product description</th>
                            <th className="border-r-2 border-black py-3 w-[15%]">Packet weight</th>
                            <th className="border-r-2 border-black py-3 w-[8%]">Qty</th>
                            <th className="border-r-2 border-black py-3 w-[12%]">Rate</th>
                            <th className="py-3 w-[12%]">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.map((item, idx) => (
                            <tr key={idx} className="border-b border-black/10 h-10 text-[13px] font-bold">
                                <td className="border-r-2 border-black text-center text-slate-400">
                                    {item.productName ? idx + 1 : ''}
                                </td>
                                <td className="border-r-2 border-black px-4">
                                    <div className="font-bold">{item.productName}</div>
                                    {item.brand && <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{item.brand}</div>}
                                </td>
                                <td className="border-r-2 border-black text-center">{item.packetWeight}</td>
                                <td className="border-r-2 border-black text-center">{item.quantity}</td>
                                <td className="border-r-2 border-black text-center">
                                    {item.unitPrice ? item.unitPrice.toLocaleString() : ''}
                                </td>
                                <td className="text-right px-4">
                                    {item.lineTotal ? item.lineTotal.toLocaleString() : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-black font-bold text-[11px]">
                            <td colSpan="5" className="border-r-2 border-black py-1 text-right px-6">SUBTOTAL</td>
                            <td className="text-right px-4 py-1">
                                {invoice.subtotal ? invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                            </td>
                        </tr>
                        <tr className="border-t border-black/10 font-bold text-[11px]">
                            <td colSpan="5" className="border-r-2 border-black py-1 text-right px-6 italic">
                                TOTAL GST {effectiveGstRate ? `(${effectiveGstRate}%)` : ''}
                            </td>
                            <td className="text-right px-4 py-1">
                                {invoice.totalTax ? invoice.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                            </td>
                        </tr>
                        <tr className="border-t-2 border-black font-black text-sm bg-slate-50">
                            <td colSpan="5" className="border-r-2 border-black py-3 text-right px-6">GRAND TOTAL</td>
                            <td className="text-right px-4 py-3 text-lg underline decoration-double underline-offset-4">
                                {invoice.grandTotal ? invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Signature Footer */}
            <div className="border-2 border-black border-t-0 flex justify-between p-4 h-24" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex flex-col justify-end">
                    <div className="w-40 border-t border-black text-[10px] text-center font-bold">Received By</div>
                </div>
                <div className="flex flex-col justify-end">
                    <div className="w-40 border-t border-black text-[10px] text-center font-bold">Signature</div>
                </div>
            </div>

            {/* Delivery Challan Status Section - Positioned at bottom */}
            {invoice.challanStatus && (
                <div className="absolute bottom-10 left-4 right-4 border border-blue-100 bg-blue-50/50 p-4 rounded-xl" style={{ pageBreakInside: 'avoid' }}>
                    <p className="text-[10px] font-black font-outfit text-blue-400 uppercase tracking-[0.2em] mb-1">Delivery Challan Status</p>
                    <p className="text-sm font-black text-blue-700 tracking-tight uppercase leading-tight">
                        {invoice.challanStatus}
                    </p>
                </div>
            )}
        </div>
    );
};

export default InvoicePreview;
