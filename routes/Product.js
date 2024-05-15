const express = require('express');
const { createProduct, fetchAllProducts, fetchAllProductsById, updateProduct } = require('../controller/Product');

const  router = express.Router();

router.post('/' , createProduct).get('/' , fetchAllProducts).get('/:id', fetchAllProductsById).patch('/:id', updateProduct);


exports.router  = router;