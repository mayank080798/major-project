const validator = require('validator');
const mongoose  = require('mongoose');

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    cart:{
        type:Object,
        required:true
    }
});

const Order = mongoose.model('Order',orderSchema);

module.exports = Order;