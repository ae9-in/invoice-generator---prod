const express = require('express');
const router = express.Router();
const { getBrands, createBrand, deleteBrand } = require('../controllers/brandController');

router.get('/', getBrands);
router.post('/', createBrand);
router.delete('/:id', deleteBrand);

module.exports = router;

