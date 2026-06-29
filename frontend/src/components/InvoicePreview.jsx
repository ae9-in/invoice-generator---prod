const InvoicePreview = ({ invoice }) => {
    // Fill up to 10 rows for that "Bill Book" feel
    const displayItems = [...(invoice.items || [])];
    const effectiveGstRate = Number(
        invoice.gstRate ??
        invoice.items?.find((item) => item?.tax !== undefined)?.tax ??
        0
    ) || 0;
    while (displayItems.length < 10) {
        displayItems.push({ productName: '', packetWeight: '', quantity: '', unitPrice: '', lineTotal: '' });
    }

    const formatAmount = (val) => {
        if (!val && val !== 0) return '';
        return Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div id="invoice-preview">
            <style>{`
                #invoice-preview {
                    background: #fff;
                    padding: 30px 32px 20px 32px;
                    min-height: 1080px;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #000;
                    font-size: 13px;
                    line-height: 1.45;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                #invoice-preview * {
                    box-sizing: border-box;
                }
                .inv-doc-type {
                    letter-spacing: 0.45em;
                    font-size: 10px;
                    font-weight: 400;
                    color: #888;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                }
                .inv-outer-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 2px solid #000;
                }
                .inv-outer-table td {
                    vertical-align: top;
                }
                /* ---- Header ---- */
                .inv-header-left {
                    text-align: center;
                    vertical-align: middle !important;
                    padding: 24px 16px;
                    border-right: 2px solid #000;
                    border-bottom: 2px solid #000;
                    width: 60%;
                }
                .inv-header-left h1 {
                    font-size: 30px;
                    font-weight: 900;
                    letter-spacing: 0.03em;
                    margin: 0;
                    line-height: 1.15;
                    font-family: 'Arial Black', Arial, sans-serif;
                }
                .inv-header-right {
                    padding: 14px 16px;
                    font-size: 11px;
                    font-weight: 600;
                    line-height: 1.6;
                    border-bottom: 2px solid #000;
                    width: 40%;
                }
                .inv-header-right p {
                    margin: 0 0 1px 0;
                }
                /* ---- Recipient ---- */
                .inv-recipient {
                    padding: 14px 20px;
                    border-bottom: 2px solid #000;
                    min-height: 90px;
                }
                .inv-recipient-label {
                    font-size: 12px;
                    font-weight: 700;
                    margin-bottom: 6px;
                }
                .inv-recipient-name {
                    font-size: 17px;
                    font-weight: 900;
                    text-transform: uppercase;
                    margin: 0 0 4px 0;
                    padding-left: 16px;
                }
                .inv-recipient-addr {
                    font-size: 12px;
                    font-weight: 500;
                    color: #333;
                    margin: 0 0 4px 0;
                    font-style: italic;
                    padding-left: 16px;
                }
                .inv-recipient-phone {
                    font-size: 12px;
                    font-weight: 800;
                    margin: 6px 0 0 0;
                    padding-left: 16px;
                }
                /* ---- Note ---- */
                .inv-note-section {
                    padding: 12px 20px;
                    border-bottom: 2px solid #000;
                }
                .inv-note-label {
                    font-size: 11px;
                    font-weight: 700;
                }
                .inv-note-text {
                    font-size: 11px;
                    font-weight: 400;
                    border-bottom: 1px solid #000;
                    padding-bottom: 2px;
                }
                /* ---- Products Table ---- */
                .inv-products-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .inv-products-table thead tr {
                    border-bottom: 2px solid #000;
                }
                .inv-products-table thead th {
                    font-size: 11px;
                    font-weight: 900;
                    text-transform: uppercase;
                    text-align: center;
                    padding: 10px 4px;
                    border-right: 2px solid #000;
                }
                .inv-products-table thead th:last-child {
                    border-right: none;
                }
                .inv-products-table thead th.inv-th-sl {
                    width: 7%;
                    font-style: italic;
                }
                .inv-products-table thead th.inv-th-product {
                    width: 42%;
                    text-align: left;
                    padding-left: 12px;
                }
                .inv-products-table thead th.inv-th-weight {
                    width: 14%;
                    line-height: 1.2;
                }
                .inv-products-table thead th.inv-th-qty {
                    width: 8%;
                }
                .inv-products-table thead th.inv-th-mrp {
                    width: 10%;
                }
                .inv-products-table thead th.inv-th-rate {
                    width: 11%;
                }
                .inv-products-table thead th.inv-th-amount {
                    width: 14%;
                }
                .inv-products-table tbody td {
                    padding: 5px 4px;
                    border-right: 2px solid #000;
                    border-bottom: 1px solid #ddd;
                    height: 36px;
                    font-size: 13px;
                    font-weight: 600;
                    text-align: center;
                }
                .inv-products-table tbody td:last-child {
                    border-right: none;
                }
                .inv-products-table tbody td.inv-td-product {
                    text-align: left;
                    padding-left: 12px;
                }
                .inv-products-table tbody td.inv-td-amount {
                    text-align: right;
                    padding-right: 12px;
                }
                .inv-products-table tbody td.inv-td-sl {
                    color: #555;
                }
                .inv-brand {
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: #444;
                    margin-top: 1px;
                }
                /* ---- Footer totals ---- */
                .inv-products-table tfoot td {
                    padding: 8px 12px;
                    font-size: 12px;
                    font-weight: 700;
                    border-right: 2px solid #000;
                }
                .inv-products-table tfoot td:last-child {
                    border-right: none;
                }
                .inv-subtotal-row {
                    border-top: 2px solid #000 !important;
                }
                .inv-subtotal-row td {
                    border-top: 2px solid #000;
                }
                .inv-gst-row td {
                    border-top: 1px solid #bbb;
                }
                .inv-grand-row {
                    border-top: 2px solid #000 !important;
                }
                .inv-grand-row td {
                    border-top: 2px solid #000;
                    padding: 10px 12px;
                }
                .inv-grand-label {
                    font-size: 14px !important;
                    font-weight: 900 !important;
                }
                .inv-grand-value {
                    border: 2px solid #000;
                    padding: 4px 14px;
                    font-size: 15px;
                    font-weight: 900;
                    display: inline-block;
                    letter-spacing: 0.02em;
                }
                /* ---- Signature ---- */
                .inv-signature-section {
                    border-top: none;
                    padding: 0;
                }
                .inv-sig-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .inv-sig-table td {
                    padding: 16px 20px;
                    height: 80px;
                    vertical-align: bottom;
                    border-top: none;
                }
                .inv-sig-line {
                    width: 160px;
                    border-top: 1px solid #000;
                    font-size: 10px;
                    text-align: center;
                    font-weight: 600;
                    font-style: italic;
                    padding-top: 4px;
                }
                /* ---- Challan ---- */
                .inv-challan {
                    margin-top: 16px;
                    border: 1px solid #d0d8e8;
                    background: #f0f4ff;
                    padding: 14px 16px;
                    border-radius: 10px;
                }
                .inv-challan-label {
                    font-size: 10px;
                    font-weight: 900;
                    color: #6b82b0;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-bottom: 4px;
                }
                .inv-challan-value {
                    font-size: 13px;
                    font-weight: 900;
                    color: #2c4a82;
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                    margin: 0;
                }
            `}</style>

            {/* Document Type Label */}
            <div className="inv-doc-type">{invoice.docType || 'INVOICE'}</div>

            {/* ===== MAIN BORDERED CONTAINER (single outer table) ===== */}
            <table className="inv-outer-table" cellPadding="0" cellSpacing="0">
                <tbody>
                    {/* ROW 1: Header — Company Name + Address */}
                    <tr>
                        <td className="inv-header-left" colSpan="1">
                            {invoice.businessName === 'Aroma Dew' ? (
                                <h1>AROMA DEW</h1>
                            ) : (
                                <h1>AKSHARA<br/>ENTERPRISES</h1>
                            )}
                        </td>
                        <td className="inv-header-right" colSpan="1">
                            <p>BHIVE Platinum</p>
                            <p>48, Church St, Haridevpur, Shanthala Nagar,</p>
                            <p>Ashok Nagar, Bengaluru, Karnataka- 560001</p>
                            <p style={{ marginTop: '6px' }}>Contact: 9731185960</p>
                        </td>
                    </tr>

                    {/* ROW 2: Recipient */}
                    <tr>
                        <td className="inv-recipient" colSpan="2">
                            <div className="inv-recipient-label">To:</div>
                            <p className="inv-recipient-name">
                                {invoice.customerName || '_________________________'}
                            </p>
                            <p className="inv-recipient-addr">
                                {invoice.customerAddress || '____________________________________________________'}
                            </p>
                            {invoice.customerPhone && (
                                <p className="inv-recipient-phone">PH: {invoice.customerPhone}</p>
                            )}
                        </td>
                    </tr>

                    {/* ROW 3: Note */}
                    <tr>
                        <td className="inv-note-section" colSpan="2">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '40px', padding: 0, verticalAlign: 'baseline' }}>
                                            <span className="inv-note-label">Note:</span>
                                        </td>
                                        <td style={{ padding: 0, verticalAlign: 'baseline' }}>
                                            <span className="inv-note-text" style={{ display: 'block' }}>
                                                {invoice.note || '\u00A0'}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    {/* ROW 4: Products Table */}
                    <tr>
                        <td colSpan="2" style={{ padding: 0 }}>
                            <table className="inv-products-table" cellPadding="0" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th className="inv-th-sl">SL.NO</th>
                                        <th className="inv-th-product">PRODUCT DESCRIPTION</th>
                                        <th className="inv-th-weight">PACKET<br/>WEIGHT</th>
                                        <th className="inv-th-qty">QTY</th>
                                        <th className="inv-th-mrp">MRP</th>
                                        <th className="inv-th-rate">RATE</th>
                                        <th className="inv-th-amount">AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="inv-td-sl">
                                                {item.productName ? idx + 1 : ''}
                                            </td>
                                            <td className="inv-td-product">
                                                <div style={{ fontWeight: 700 }}>{item.productName}</div>
                                                {item.brand && (
                                                    <div className="inv-brand">{item.brand}</div>
                                                )}
                                            </td>
                                            <td>{item.packetWeight}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                {item.productName ? (item.mrp ? Number(item.mrp).toLocaleString('en-IN') : '0') : ''}
                                            </td>
                                            <td>
                                                {item.unitPrice ? Number(item.unitPrice).toLocaleString('en-IN') : ''}
                                            </td>
                                            <td className="inv-td-amount">
                                                {item.lineTotal ? formatAmount(item.lineTotal) : ''}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    {/* SUBTOTAL */}
                                    <tr className="inv-subtotal-row">
                                        <td colSpan="6" style={{ textAlign: 'right', paddingRight: '16px' }}>
                                            SUBTOTAL
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {formatAmount(invoice.subtotal)}
                                        </td>
                                    </tr>
                                    {/* TOTAL GST */}
                                    <tr className="inv-gst-row">
                                        <td colSpan="6" style={{ textAlign: 'right', paddingRight: '16px' }}>
                                            TOTAL GST {effectiveGstRate ? `(${effectiveGstRate}%)` : ''}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {formatAmount(invoice.totalTax)}
                                        </td>
                                    </tr>
                                    {/* GRAND TOTAL */}
                                    <tr className="inv-grand-row">
                                        <td colSpan="6" style={{ textAlign: 'right', paddingRight: '16px' }} className="inv-grand-label">
                                            GRAND TOTAL
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span className="inv-grand-value">
                                                {formatAmount(invoice.grandTotal)}
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </td>
                    </tr>

                    {/* ROW 5: Signature */}
                    <tr>
                        <td colSpan="2" className="inv-signature-section">
                            <table className="inv-sig-table" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: 'left' }}>
                                            <div className="inv-sig-line">Received By</div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="inv-sig-line" style={{ marginLeft: 'auto' }}>Signature</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Delivery Challan Status */}
            {invoice.challanStatus && (
                <div className="inv-challan">
                    <p className="inv-challan-label">Delivery Challan Status</p>
                    <p className="inv-challan-value">{invoice.challanStatus}</p>
                </div>
            )}
        </div>
    );
};

export default InvoicePreview;
