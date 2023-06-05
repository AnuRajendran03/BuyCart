var mongoose = require ('mongoose');

const productModel = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"username is needed"]
    },
    price : {
        type:String,
        required:[true,"username is needed"]
    },
    offer : {
        type:String,
        required:[true,"username is needed"]
    },
    description : {
        type:String,
        required:[true,"username is needed"]
    }
})
module.exports = mongoose.model('productModel',productModel);