const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoiceRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const errorHandler = require('./middleware/errorHandler');

// Configure environment variables
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database only in non-serverless environments
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
    connectDB();
}

const app = express();

// Middleware
app.use(cors());
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});
app.use(express.json({ limit: '50mb' })); // Higher limit for Base64 logo uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);

// Add health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5006;

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

module.exports = app;
