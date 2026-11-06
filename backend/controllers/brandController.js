const Brand = require('../models/Brand');

// Get all brand cards
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new brand card
const createBrand = async (req, res) => {
    try {
        const { name, displayName, description, address, phone, email, docType, color } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Brand name is required' });
        }

        const brand = new Brand({
            name: name.trim(),
            displayName: (displayName && displayName.trim()) || name.trim(),
            description: (description && description.trim()) || `Generate professional invoices specifically for ${name.trim()} products.`,
            address: (address && address.trim()) || 'BHIVE Platinum, 48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka- 560001',
            phone: (phone && phone.trim()) || '9731185960',
            email: (email && email.trim()) || 'contact@akshara.in',
            docType: docType || 'INVOICE',
            color: color || 'blue'
        });

        const savedBrand = await brand.save();
        res.status(201).json(savedBrand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a brand card
const deleteBrand = async (req, res) => {
    try {
        const deleted = await Brand.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Brand card not found' });
        }
        res.status(200).json({ message: 'Brand card removed successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBrands,
    createBrand,
    deleteBrand
};

