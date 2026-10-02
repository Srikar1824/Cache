const fs = require('fs/promises')
const path = require('path')

const filepath = path.join(__dirname,'../db.json')

async function getProducts(){
    try {
        let data = await fs.readFile(filepath, 'utf-8');
        const products = JSON.parse(data);
        return Array.isArray(products) ? products.filter(p => p !== null) : [];
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function createProducts(product){
    try{
        let data = await fs.readFile(filepath,'utf-8')
        const products = JSON.parse(data)

        products.push(product)

        await fs.writeFile(filepath,JSON.stringify(products,null,2))
        return product;
    }
    catch(err){
        console.log(err)
    }
}

async function updateProduct(id, updatedData) {
    try {
        const products = await getProducts();
        const index = products.findIndex(p => p && p.id === id);
        
        if (index === -1) {
            return null;
        }

        const updatedProduct = { ...updatedData, id };
        products[index] = updatedProduct;

        await fs.writeFile(filepath, JSON.stringify(products, null, 2));
        return updatedProduct;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function patchProduct(id, partialData) {
    try {
        const products = await getProducts();
        const index = products.findIndex(p => p && p.id === id);

        if (index === -1) {
            return null;
        }

        const updatedProduct = { ...products[index], ...partialData, id };
        products[index] = updatedProduct;

        await fs.writeFile(filepath, JSON.stringify(products, null, 2));
        return updatedProduct;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function deleteProduct(id) {
    try {
        const products = await getProducts();
        const index = products.findIndex(p => p && p.id === id);

        if (index === -1) {
            return null;
        }

        const deletedProduct = products.splice(index, 1)[0];
        await fs.writeFile(filepath, JSON.stringify(products, null, 2));
        return deletedProduct;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getProducts, createProducts, updateProduct, patchProduct, deleteProduct };