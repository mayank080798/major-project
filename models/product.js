const validator = require('validator');
const mongoose  = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    thumbnail:{
        type:String,
    },
    features:{
        first:{
            type:String,
        },
        second:{
            type:String,
        },
        third:{
            type:String,
        },
        fourth:{
            type:String
        }
    },
    specifications:{
        CPU:{
            type:String
        },
        Graphics:{
            type:String,
        },
        RAM:{
            type:String,
        },
        Storage:{
            type:String,
        },
        Connectivity:{
            type:String,
        },
        Dimensions:{
            type:String,
        }
    },
    data:{
        type:String,
    },
    
});


const Products = mongoose.model('Products',productSchema);
module.exports=Products;
