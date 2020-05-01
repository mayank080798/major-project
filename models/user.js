const validator = require('validator');
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const userSchema = new mongoose.Schema({
    
    local:{
        email:{
            type:String,
            trim:true,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value))
                    throw new Error({message:'E-mail is invalid'});
            }
        },
        password:{
            type:String,
            trim:true,
            validate(value){
                if(value.toLowerCase().includes('password'))
                    throw ('Password must be unique.');
                if(value<6)
                    throw ('Password strength is weak');
            }
        },
        username:{
            type:String,
            trim:true
        },
    },
    google:{
        name:{
            type:String,
            trim:true
        },
        id:{
            type:String
        },
        thumbnail:{
            type:String
        },
        token :{
            type: String,
        },
        email:{
            type:String,
            trim:true,
            lowercase:true,
        }
    }
    
    
    
    
});

userSchema.pre('save',async function(next){
    const user = this;
    const saltRounds = 10;
    if(!user.isModified('local.password'))
        return next();
    const salt = await bcrypt.genSalt(saltRounds);
    user.local.password = await bcrypt.hash(user.local.password,salt);
    next();
});

userSchema.methods.isValidPassword=async function(password){
    const user=this;
    try{
        const isMatch=await bcrypt.compare(password,user.local.password);
        console.log(isMatch);
        return isMatch;
    }catch(error){
        throw new Error(error);
    }
};

const User = mongoose.model('User',userSchema);
module.exports=User;