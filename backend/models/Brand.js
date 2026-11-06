const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    displayName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        default: '' 
    },
    address: { 
        type: String, 
        required: true, 
        default: 'BHIVE Platinum, 48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka- 560001' 
    },
    phone: { 
        type: String, 
        default: '9731185960' 
    },
    email: { 
        type: String, 
        default: 'contact@akshara.in' 
    },
    docType: { 
        type: String, 
        enum: ['INVOICE', 'QUOTATION'], 
        default: 'INVOICE' 
    },
    color: { 
        type: String, 
        default: 'blue' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);

