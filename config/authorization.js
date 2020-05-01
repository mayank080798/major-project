module.exports={
    ensureAuthenticated: (request,response,next)=>{
        if(request.isAuthenticated()){
            return next();
        }
        response.redirect('/user/login');
    }
}