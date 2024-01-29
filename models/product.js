const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    }
})

const Product = mongoose.model('Product', productSchema);

// 在Node.js上下文中，module 是一个特殊的对象，代表当前模块。
// 它包含有关当前模块的信息，如文件名，并提供一种将变量、函数或对象从模块中导出的方式。
module.exports = Product;