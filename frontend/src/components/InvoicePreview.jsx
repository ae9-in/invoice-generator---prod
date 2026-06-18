import StatusBadge from './StatusBadge';

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
        <div
            id="invoice-preview"
            style={{
                background: '#fff',
                padding: '36px 40px 28px 40px',
                minHeight: '1080px',
                fontFamily: "'Arial', 'Helvetica', sans-serif",
                color: '#000',
                position: 'relative',
                fontSize: '13px',
                lineHeight: 1.45,
            }}
        >
            {/* Document Type Label */}
            <div
                style={{
                    letterSpacing: '0.45em',
                    fontSize: '10px',
                    fontWeight: 400,
                    color: '#888',
                    textTransform: 'uppercase',
                    marginBottom: '14px',
                }}
            >
                {invoice.docType || 'INVOICE'}
            </div>

            {/* ===== HEADER: Company Name + Address ===== */}
            <div
                style={{
                    border: '2px solid #000',
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: 0,
                }}
            >
                {/* Left side — Company Name */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '28px 20px',
                        borderRight: '2px solid #000',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '30px',
                            fontWeight: 900,
                            letterSpacing: '0.03em',
                            textAlign: 'center',
                            margin: 0,
                            lineHeight: 1.15,
                            fontFamily: "'Arial Black', 'Arial', sans-serif",
                        }}
                    >
                        AKSHARA<br />ENTERPRISES
                    </h1>
                </div>
                {/* Right side — Address */}
                <div
                    style={{
                        width: '260px',
                        padding: '14px 16px',
                        fontSize: '11px',
                        fontWeight: 600,
                        lineHeight: 1.55,
                    }}
                >
                    <p style={{ margin: '0 0 2px 0' }}>BHIVE Platinum</p>
                    <p style={{ margin: '0 0 2px 0' }}>48, Church St, Haridevpur, Shanthala Nagar,</p>
                    <p style={{ margin: '0 0 2px 0' }}>Ashok Nagar, Bengaluru, Karnataka- 560001</p>
                    <p style={{ margin: '6px 0 0 0' }}>Contact: 9731185960</p>
                </div>
            </div>

            {/* ===== TO: Recipient Section ===== */}
            <div
                style={{
                    border: '2px solid #000',
                    borderTop: 'none',
                    padding: '16px 20px',
                    minHeight: '90px',
                }}
            >
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>To:</div>
                <div style={{ paddingLeft: '20px' }}>
                    <p
                        style={{
                            fontSize: '17px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            margin: '0 0 4px 0',
                        }}
                    >
                        {invoice.customerName || '_________________________'}
                    </p>
                    <p
                        style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#333',
                            maxWidth: '420px',
                            margin: '0 0 4px 0',
                            fontStyle: 'italic',
                        }}
                    >
                        {invoice.customerAddress || '____________________________________________________'}
                    </p>
                    {invoice.customerPhone && (
                        <p
                            style={{
                                fontSize: '12px',
                                fontWeight: 800,
                                margin: '6px 0 0 0',
                            }}
                        >
                            PH: {invoice.customerPhone}
                        </p>
                    )}
                </div>
            </div>

            {/* ===== NOTE Section ===== */}
            <div
                style={{
                    border: '2px solid #000',
                    borderTop: 'none',
                    padding: '14px 20px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span
                        style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            flexShrink: 0,
                        }}
                    >
                        Note:
                    </span>
                    <span
                        style={{
                            flex: 1,
                            borderBottom: '1px solid #000',
                            fontSize: '11px',
                            fontWeight: 400,
                            paddingBottom: '2px',
                        }}
                    >
                        {invoice.note || ''}
                    </span>
                </div>
            </div>

            {/* ===== Product Table ===== */}
            <div
                style={{
                    border: '2px solid #000',
                    borderTop: 'none',
                }}
            >
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                borderBottom: '2px solid #000',
                                fontSize: '11px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                textAlign: 'center',
                            }}
                        >
                            <th
                                style={{
                                    borderRight: '2px solid #000',
                                    padding: '10px 4px',
                                    width: '7%',
                                    fontStyle: 'italic',
                                }}
                            >
                                SL.NO
                            </th>
                            <th
                                style={{
                                    borderRight: '2px solid #000',
                                    padding: '10px 12px',
                                    width: '42%',
                                    textAlign: 'left',
                                }}
                            >
                                PRODUCT DESCRIPTION
                            </th>
                            <th
                                style={{
                                    borderRight: '2px solid #000',
                                    padding: '10px 4px',
                                    width: '14%',
                                    lineHeight: 1.2,
                                }}
                            >
                                PACKET<br />WEIGHT
                            </th>
                            <th
                                style={{
                                    borderRight: '2px solid #000',
                                    padding: '10px 4px',
                                    width: '8%',
                                }}
                            >
                                QTY
                            </th>
                            <th
                                style={{
                                    borderRight: '2px solid #000',
                                    padding: '10px 4px',
                                    width: '12%',
                                }}
                            >
                                RATE
                            </th>
                            <th
                                style={{
                                    padding: '10px 4px',
                                    width: '14%',
                                }}
                            >
                                AMOUNT
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.map((item, idx) => (
                            <tr
                                key={idx}
                                style={{
                                    borderBottom: '1px solid #ddd',
                                    height: '38px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}
                            >
                                <td
                                    style={{
                                        borderRight: '2px solid #000',
                                        textAlign: 'center',
                                        color: '#555',
                                        padding: '4px',
                                    }}
                                >
                                    {item.productName ? idx + 1 : ''}
                                </td>
                                <td
                                    style={{
                                        borderRight: '2px solid #000',
                                        padding: '6px 12px',
                                    }}
                                >
                                    <div style={{ fontWeight: 700 }}>{item.productName}</div>
                                    {item.brand && (
                                        <div
                                            style={{
                                                fontSize: '10px',
                                                fontWeight: 900,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.12em',
                                                color: '#444',
                                                marginTop: '1px',
                                            }}
                                        >
                                            {item.brand}
                                        </div>
                                    )}
                                </td>
                                <td
                                    style={{
                                        borderRight: '2px solid #000',
                                        textAlign: 'center',
                                        padding: '4px',
                                    }}
                                >
                                    {item.packetWeight}
                                </td>
                                <td
                                    style={{
                                        borderRight: '2px solid #000',
                                        textAlign: 'center',
                                        padding: '4px',
                                    }}
                                >
                                    {item.quantity}
                                </td>
                                <td
                                    style={{
                                        borderRight: '2px solid #000',
                                        textAlign: 'center',
                                        padding: '4px',
                                    }}
                                >
                                    {item.unitPrice ? item.unitPrice.toLocaleString('en-IN') : ''}
                                </td>
                                <td
                                    style={{
                                        textAlign: 'right',
                                        padding: '4px 12px',
                                    }}
                                >
                                    {item.lineTotal ? formatAmount(item.lineTotal) : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        {/* SUBTOTAL */}
                        <tr style={{ borderTop: '2px solid #000' }}>
                            <td
                                colSpan="5"
                                style={{
                                    borderRight: '2px solid #000',
                                    padding: '8px 16px',
                                    textAlign: 'right',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                }}
                            >
                                SUBTOTAL
                            </td>
                            <td
                                style={{
                                    textAlign: 'right',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                }}
                            >
                                {formatAmount(invoice.subtotal)}
                            </td>
                        </tr>
                        {/* TOTAL GST */}
                        <tr style={{ borderTop: '1px solid #bbb' }}>
                            <td
                                colSpan="5"
                                style={{
                                    borderRight: '2px solid #000',
                                    padding: '8px 16px',
                                    textAlign: 'right',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                }}
                            >
                                TOTAL GST {effectiveGstRate ? `(${effectiveGstRate}%)` : ''}
                            </td>
                            <td
                                style={{
                                    textAlign: 'right',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                }}
                            >
                                {formatAmount(invoice.totalTax)}
                            </td>
                        </tr>
                        {/* GRAND TOTAL */}
                        <tr style={{ borderTop: '2px solid #000' }}>
                            <td
                                colSpan="5"
                                style={{
                                    borderRight: '2px solid #000',
                                    padding: '10px 16px',
                                    textAlign: 'right',
                                    fontSize: '14px',
                                    fontWeight: 900,
                                }}
                            >
                                GRAND TOTAL
                            </td>
                            <td
                                style={{
                                    textAlign: 'right',
                                    padding: '10px 12px',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        border: '2px solid #000',
                                        padding: '4px 14px',
                                        fontSize: '15px',
                                        fontWeight: 900,
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {formatAmount(invoice.grandTotal)}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* ===== Signature Footer ===== */}
            <div
                style={{
                    border: '2px solid #000',
                    borderTop: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    height: '90px',
                    alignItems: 'flex-end',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div
                        style={{
                            width: '160px',
                            borderTop: '1px solid #000',
                            fontSize: '10px',
                            textAlign: 'center',
                            fontWeight: 600,
                            paddingTop: '4px',
                            fontStyle: 'italic',
                        }}
                    >
                        Received By
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div
                        style={{
                            width: '160px',
                            borderTop: '1px solid #000',
                            fontSize: '10px',
                            textAlign: 'center',
                            fontWeight: 600,
                            paddingTop: '4px',
                            fontStyle: 'italic',
                        }}
                    >
                        Signature
                    </div>
                </div>
            </div>

            {/* Delivery Challan Status Section - Only on Invoices */}
            {invoice.challanStatus && (
                <div
                    style={{
                        marginTop: '16px',
                        border: '1px solid #d0d8e8',
                        backgroundColor: '#f0f4ff',
                        padding: '14px 16px',
                        borderRadius: '10px',
                    }}
                >
                    <p
                        style={{
                            fontSize: '10px',
                            fontWeight: 900,
                            color: '#6b82b0',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '4px',
                        }}
                    >
                        Delivery Challan Status
                    </p>
                    <p
                        style={{
                            fontSize: '13px',
                            fontWeight: 900,
                            color: '#2c4a82',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            margin: 0,
                        }}
                    >
                        {invoice.challanStatus}
                    </p>
                </div>
            )}
        </div>
    );
};

export default InvoicePreview;
