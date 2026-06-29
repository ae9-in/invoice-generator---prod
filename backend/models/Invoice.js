const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brand: { type: String },
    packetWeight: { type: String, required: true, trim: true },
    description: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    mrp: { type: Number, default: 0 },
    unitPrice: { type: Number, required: true, min: 0.01 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    lineTotal: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
    businessName: { type: String, required: true, default: 'Akshara Enterprises' },
    businessAddress: { type: String, required: true },
    businessEmail: { type: String, required: true },
    businessPhone: { type: String, required: true },

    customerName: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String, required: true, trim: true },

    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Paid', 'Unpaid', 'Pending'], 
        default: 'Pending' 
    },
    challanStatus: { type: String },
    gstRate: { type: Number, default: 0 },

    items: [itemSchema],
    
    subtotal: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    totalDiscount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    
    notes: { type: String },
    logo: { type: String }, // Placeholder for logo URL or Base64 string
    
    // Ownership tracking remains optional when direct access is enabled.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    userName: { type: String, required: true, default: 'Akshara Team' }

}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
