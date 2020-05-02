const router                = require('express').Router();
const passport              = require('passport');
const User                  = require('../models/user');
const {ensureAuthenticated} = require('../config/authorization');
const Products              = require('../models/product');
const Cart                  = require('../models/cart');
const Order                 = require('../models/order');
const sendWelcomeEmail      = require('../emails/account');


router.get('/login',(request,response)=>{
    response.render('login',{
        user:request.user,
        message : request.flash('logInMessage'),
    });
});

router.get('/register',(request,response)=>{
    response.render('register',{
        user:request.user,
        message : request.flash('signUpMessage'),
    });
});

router.get('/logout',(request,response)=>{
    request.logout();
    request.session.destroy();
    response.redirect('/');
});

router.post('/register',passport.authenticate('local-signup',{
        failureRedirect : '/user/register',
        failureFlash    : true,
    }),async (request,response,next)=>{
        console.log('User registered');
        //sendWelcomeEmail(request.body.email,request.body.name);
        response.redirect('/');
});

router.post('/login',(request,response,next)=>{
    passport.authenticate('local-login',{
        successRedirect:'/product',
        failureRedirect:'/user/login',
        failureFlash:true
    })(request,response,next);
});

router.get('/google',passport.authenticate('google',{
    scope:['profile','email','https://www.googleapis.com/auth/user.birthday.read']
}));

router.get('/auth/google/callback',passport.authenticate('google',{
    failureFlash    : true,
    failureRedirect : '/'
}), (request,response)=>{
    console.log('User logged in through google');
    response.redirect('/');
});

router.get('/connect/google',passport.authorize('google',{
    scope:['profile','email']
}),(request,response)=>{
    console.log(request.sessionID);
});

router.get('/cart/:id',ensureAuthenticated,async(request,response)=>{
    const productId= request.params.id;
    const cart = new Cart(request.session.cart ? request.session.cart : {});
    //response.render('cart',{user:request.user});
    try{
        const product = await Products.findById(productId);
        cart.add(product,product.id);
        request.session.cart = cart;
        response.redirect('/user/shopping-cart');
    }catch(e){
        return response.redirect('/product');
    }

});



router.get('/reduce/:id',async(request,response)=>{
    const productId = request.params.id;
    const cart      = new Cart(request.session.cart ? request.session.cart : {}); 

    cart.reduceByOne(productId);
    request.session.cart = cart;
    let bucket = 0;
    if(request.session.cart)
        bucket = request.session.cart.totalQty > 0 ? request.session.cart.totalQty : 0; 
    response.render('cart',{
        user:request.user,
        products:cart.totalQty > 0 ? cart.generateArray():0,
        bucket:bucket
    });
});
router.get('/remove/:id',async(request,response)=>{
    const productId = request.params.id;
    console.log('Product ID:',productId);
    const cart      = new Cart(request.session.cart?request.session.cart:{});
    cart.removeItem(productId);
    request.session.cart = cart;
    let bucket = 0;
    if(request.session.cart)
        bucket = request.session.cart.totalQty > 0 ? request.session.cart.totalQty : 0; 

    response.render('cart',{
        user:request.user,
        products:cart.totalQty > 0 ? cart.generateArray():0,
        bucket:bucket
    });
});

router.get('/shopping-cart',ensureAuthenticated,async (request,response)=>{
    //const bucket = request.session.cart.totalQty > 0 ? request.session.cart.totalQty : 0;
    if(!request.session.cart){
        return response.render('cart',{
            user:request.user,
            bucket:0 ,
            products:0
        });
    }
    const cart = new Cart(request.session.cart);
    //console.log(cart.generateArray());
    response.render('cart',{
        user:request.user,
        bucket:request.session.cart.totalQty > 0 ? request.session.cart.totalQty : 0 ,
        products:cart.totalQty>0 ? cart.generateArray() : 0,
    });
});


module.exports=router;