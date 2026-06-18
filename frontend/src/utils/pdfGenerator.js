import html2pdf from 'html2pdf.js';

export const downloadInvoiceAsPDF = (elementId, invoiceNumber = 'invoice') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error("Element not found for PDF generation");
        return;
    }

    const options = {
        margin: [8, 6, 8, 6],
        filename: `${invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
            backgroundColor: '#ffffff',
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().from(element).set(options).save();
};

export const printInvoice = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print Invoice</title>');

    // Extract the embedded <style> tag from the invoice preview
    const embeddedStyles = element.querySelectorAll('style');
    embeddedStyles.forEach(style => {
        printWindow.document.write(`<style>${style.innerHTML}</style>`);
    });

    // Custom styles for printing
    printWindow.document.write(`
        <style>
            body { 
                padding: 0; 
                margin: 0;
                font-family: Arial, Helvetica, sans-serif; 
                background: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .no-print { display: none !important; }
            @media print {
                body { margin: 0; padding: 0; }
            }
        </style>
    `);

    printWindow.document.write('</head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
};
