/**
 * Validation utility functions for invoice forms.
 */

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
    // Basic phone validation (at least 10 digits)
    const re = /^\+?[0-9]{10,14}$/;
    return re.test(String(phone).replace(/\s/g, ''));
};

export const validateInvoice = (invoice) => {
    const errors = {};

    if (!invoice.businessName?.trim()) errors.businessName = "Brand / Business name is required";
    if (!invoice.businessAddress?.trim()) errors.businessAddress = "Brand / Business address is required";
    if (!invoice.customerName?.trim()) errors.customerName = "Customer name is required";
    if (!invoice.customerAddress?.trim()) errors.customerAddress = "Customer address is required";
    if (!invoice.customerPhone?.trim()) {
        errors.customerPhone = "Phone number is required";
    } else if (!validatePhone(invoice.customerPhone)) {
        errors.customerPhone = "Enter a valid phone number";
    }

    if (!invoice.items || invoice.items.length === 0) {
        errors.items = "At least one product is required";
    } else {
        invoice.items.forEach((item, index) => {
            if (!item.productName?.trim()) {
                if (!errors.items_detail) errors.items_detail = [];
                errors.items_detail[index] = { ...errors.items_detail[index], productName: "Product name is required" };
            }
            if (!item.packetWeight?.trim()) {
                if (!errors.items_detail) errors.items_detail = [];
                errors.items_detail[index] = { ...errors.items_detail[index], packetWeight: "Net weight is required" };
            }
            if (Number(item.quantity) <= 0) {
                if (!errors.items_detail) errors.items_detail = [];
                errors.items_detail[index] = { ...errors.items_detail[index], quantity: "Quantity must be greater than 0" };
            }
            if (Number(item.unitPrice) <= 0) {
                if (!errors.items_detail) errors.items_detail = [];
                errors.items_detail[index] = { ...errors.items_detail[index], unitPrice: "Rate must be greater than 0" };
            }
        });
    }

    if (!invoice.dueDate) errors.dueDate = "Due date is required";

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const getInvoiceValidationMessage = (errors) => {
    const topLevelMessage = [
        errors.businessName,
        errors.businessAddress,
        errors.customerName,
        errors.customerAddress,
        errors.customerPhone,
        errors.items,
        errors.dueDate,
    ].find(Boolean);

    if (topLevelMessage) {
        return topLevelMessage;
    }

    const firstItemIndex = errors.items_detail?.findIndex(Boolean);
    if (firstItemIndex !== undefined && firstItemIndex >= 0) {
        const firstItemError = Object.values(errors.items_detail[firstItemIndex] || {}).find(Boolean);
        if (firstItemError) {
            return `Item ${firstItemIndex + 1}: ${firstItemError}`;
        }
    }

    return "Please fill all required fields except Delivery Challan";
};
