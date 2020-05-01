const mongoose = require('mongoose');
const keys     = require('../config/keys');

mongoose.connect(keys.mongodb.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true
});