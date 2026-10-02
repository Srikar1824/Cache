const express = require('express')
const router = express.Router()
const { getProducts, getProductsById, createProducts, updateProduct, patchProduct, deleteProduct } = require('../controllers/productController.js')
const { cacheMiddleware, cacheMiddlewareForId } = require('../middleware/cache');

router.get('/', cacheMiddleware, getProducts)
router.get('/:id', cacheMiddlewareForId, getProductsById)
router.post('/', createProducts)
router.put('/:id', updateProduct)
router.patch('/:id', patchProduct)
router.delete('/:id', deleteProduct)

module.exports = router