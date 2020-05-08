const { clearHash } = require('../services/cache');

module.exports = async (request,response,next)=>{
    await next();
    clearHash({key:request.user.id});
}