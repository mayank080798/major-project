const express       = require('express');
const PORT          = process.env.PORT || 3000;
require('./db/mongoose'); 
const mongoose      = require('mongoose');
const expressLayouts=require('express-ejs-layouts');
const passportSetup = require('./config/passport');
const passport      = require('passport');
const cookieSession = require('cookie-session');
const session       = require('express-session');
const mongoStore    = require('connect-mongo')(session);
const userRouter    = require('./routers/user');
const productRouter = require('./routers/product');
const orderRouter   = require('./routers/order');
const keys          = require('./config/keys');
const app           = express();
const bodyParser    = require('body-parser');
const Products      = require('./models/product');
const flash         = require('connect-flash');

// Set up view engine
app.use(express.static(__dirname+'/public'));
app.use(expressLayouts);
app.set('view engine','ejs');



// Set up express session
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    name                : keys.session.COOKIE_NAME,
    secret              : keys.session.COOKIE_SECRET,
    resave              : false,
    saveUninitialized   : false,
    store               : new mongoStore({mongooseConnection:mongoose.connection}),
    cookie:{
        maxAge:24*60*60*1000,
    }
}));


// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(function(request,response,next){
    response.locals.session=request.session;
    next();
});
app.use(flash());


// Routers
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/order',orderRouter);


app.get('/',async (request,response)=>{
    const products = await Products.find({});
    const productsHome=[];
    products.forEach((product,index)=>{
        if(index<=2)
            productsHome.push(product);
    });
    let bucket=0;
    if(request.session.cart)
        bucket =request.session.cart.totalQty > 0 ? request.session.cart.totalQty : 0 ;
    response.render('home',{
        user:request.user,
        bucket:bucket,
        records:productsHome,
    });

    
});

app.get('/about',async (request,response)=>{
    response.render('about',{user:request.user});
}); 

app.listen(PORT,()=>{
    console.log(`Server is up at ${PORT}`);
});
