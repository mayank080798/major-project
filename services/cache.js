const mongoose = require('mongoose');
const redis    = require('redis');
const util     = require('util');

const redisURL = 'redis://127.0.0.1:6379' || process.env.REDIS_URL;
let client;
// if(process.env.REDIS_URL)
//     client = redis.createClient(process.env.REDIS_URL);
// else
client = redis.createClient(redisURL);
client.hget     = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options={}){
    this.useCache = true;
    this.hashKey  = JSON.stringify(options.key || 'default'); 
    return this;
}


mongoose.Query.prototype.exec = async function() {
    if(!this.useCache){
        return exec.apply(this,arguments);
    }
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
          collection: this.mongooseCollection.name,
        })
    );
    const cachedValue = await client.hget(this.hashKey,key);
    if(cachedValue){
        console.log('cachedValue');
        const doc = JSON.parse(cachedValue);
        return Array.isArray(doc)
        ? doc.map((d) => new this.model(d))
        : new this.model(doc)
    } 
    const result = await exec.apply(this,arguments);
    client.hmset(this.hashKey,key,JSON.stringify(result),'EX',10);
    return result;
};

module.exports={
    clearHash(options={}){
        client.del(JSON.stringify(options.key));
    }
}
