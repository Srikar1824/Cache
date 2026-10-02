const {
    getProducts: readProducts,
    createProducts: addProduct,
    updateProduct: updateProductById,
    patchProduct: patchProductById,
    deleteProduct: deleteProductById,
} = require('../database/productDB');
const { setCache, clearCache } = require('../middleware/cache');

async function fetchProducts() {
    return await readProducts();
}

async function fetchProductsById(id) {
    const products = await readProducts();
    return products.find((product) => product.id === id) || null;
}

async function addNewProduct(product) {
    return await addProduct(product);
}

async function editProduct(id, updatedData) {
    return await updateProductById(id, updatedData);
}

async function modifyProduct(id, partialData) {
    return await patchProductById(id, partialData);
}

async function removeProduct(id) {
    return await deleteProductById(id);
}

async function getProducts(req, res) {
    try {
        const products = await fetchProducts()
        
        if (!products) {
            return res.status(404).json({
                message: "Products not found"
            });
        }

        else {
            setCache(req.url, products);
            return res.json(products)
        }
    }
    catch (err) {
        res.send(err)
    }

}
async function getProductsById(req, res) {
    try {
        const id = Number(req.params.id)
        const product = await fetchProductsById(id);
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        } else {

            setCache(`product_${id}`, product);
            return res.json(product)
        }
    }
    catch (err) {
        res.send(err)
    } 
}
async function createProducts(req,res){
    try{
        const product = req.body
        const newProduct = await addNewProduct(product)
        clearCache();
        return res.status(201).json(newProduct)
    }
    catch(err){
        res.status(500).json({message:"Error creating product"})
    }
}

async function updateProduct(req, res) {
    try {
        const id = Number(req.params.id);
        const updatedData = req.body;
        const updatedProduct = await editProduct(id, updatedData);

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        clearCache();
        return res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: "Error updating product" });
    }
}

async function patchProduct(req, res) {
    try {
        const id = Number(req.params.id);
        const partialData = req.body;
        const updatedProduct = await modifyProduct(id, partialData);

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        clearCache();
        return res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: "Error updating product" });
    }
}

async function deleteProduct(req, res) {
    try {
        const id = Number(req.params.id);
        const deletedProduct = await removeProduct(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        clearCache();
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product" });
    }
}

module.exports = { getProducts, getProductsById, createProducts, updateProduct, patchProduct, deleteProduct }