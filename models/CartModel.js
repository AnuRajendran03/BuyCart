var mongoose = require ('mongoose');

const CartModel = new mongoose.Schema({
    userId :String,
    products: Array  
})
module.exports = mongoose.model('CartModel',CartModel);