const cluster       = require('cluster');
const express       = require('express');
const PORT          = process.env.PORT || 8080;
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
cluster.schedulingPolicy = cluster.SCHED_RR;

let workers         = [];

const masterProcess=()=>{
    const numWorkers = require('os').cpus().length;

    console.log(`Master cluster with id ${process.pid} setting up ${numWorkers} workers..`);
    
    for(var i=0;i<numWorkers;i++){
        workers.push(cluster.fork());
        workers[i].on('message',(message)=>{
            // console.log(`Master ${process.id} receives message '${JSON.stringify(message)}' from worker `);
        });
    }
    cluster.on('online',(worker)=>{
        console.log(`Worker ${worker.process.pid} is online`);
    });
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`Worker ${worker.process.pid} died with code ${code}, and signal ${signal}`);
        console.log('Starting a new worker');
        cluster.fork();
        workers.push(cluster.fork());
        workers[workers.length-1].on('message',(message)=>{
            console.log(message);
        });
    });
}
const childProcess = ()=>{
    // console.log(`Worker ${process.pid} started`);

    // process.on('message', function(message) {
    //     console.log(`Worker ${process.pid} recevies message '${JSON.stringify(message)}'`);
    // });

    // console.log(`Worker ${process.pid} sends message to master...`);
    // process.send({ msg: `Message from worker ${process.pid}` });

}
if(cluster.isMaster){
    masterProcess();
}else{
    childProcess();
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
    
    require('./services/cache');
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
    function doWork(duration){
        const start = Date.now();
         while(Date.now()-start < duration){}
    }
    app.get('/',async (request,response)=>{
        //doWork(5000);
        console.log(process.pid);
        const products = await Products.find({}).cache({key:1});
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
    app.listen(PORT,()=>{
        console.log(`Server is up at ${PORT}`);
    });
}