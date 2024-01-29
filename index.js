const express = require('express');
const app = express();
// This line imports the built-in Node.js module path. 
// It provides utilities for working with file and directory paths.
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Product = require('./models/product');


mongoose.connect('mongodb://localhost:27017/farm', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express built-in middleware for parse submitted form in POST req
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy', 'fungi'];


// main page: /products

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    }


})

// create new product

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

// middleware store submitted data in req.body, which we can access
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct)
    res.redirect(`/products/${newProduct._id}`)
})

// async route handler
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
})

// behaviors PUT or DELETE coordinates with '?_method= ' in form action
app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    // update the data
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!");
})
