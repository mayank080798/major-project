const router                = require('express').Router();
const {ensureAuthenticated} = require('../config/authorization');
const Order                 = require('../models/order');

router.get('/',ensureAuthenticated,async (request,response)=>{
    if(request.session.cart){
        try{
            const order = new Order({
                user:request.user,
                cart:request.session.cart,
            });
            order.save((err,result)=>{
                request.session.cart = null;
                response.redirect('/');
            });
            
        }catch(e){

        }
        
    }

});



module.exports = router;