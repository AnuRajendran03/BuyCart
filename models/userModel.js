var mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    user : {
        type:String,
        required:[true,"username is needed"]
    },
    email : {
        type:String,
        required:[true,"username is needed"]
    },
    password : {
        type:String,
        required:[true,"username is needed"]
    },
    cpassword : {
        type:String,
        required:[true,"username is needed"]
    }
})
module.exports = mongoose.model('user',userSchema);