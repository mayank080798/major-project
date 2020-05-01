const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy  = require('passport-local').Strategy;
const keys           = require('../config/keys');
const User           = require('../models/user');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    const user = await User.findById(id);
    console.log("Logged in user:",user.local.email);
    if(user)
        done(null,user);
});

passport.use(
    new GoogleStrategy({
        callbackURL         : keys.googleAPI.CALLBACK_URL,
        clientID            : keys.googleAPI.CLIENT_ID,
        clientSecret        : keys.googleAPI.CLIENT_SECRET,
        passReqToCallback   : true
    },async (request,accessToken,refreshToken,profile,done)=>{
        if(!request.user){
            try{
                const user = await User.findOne({'google.id':profile.id});
                if(user){
                    if(!user.google.token){
                        user.google.token   = accessToken;
                        user.google.name    = profile.displayName;
                        user.google.email   = profile.emails[0].value;  
                    }
                    return done(null,user);
                }
                const newUser = new User({
                    'google.id'         : profile.id,
                    'google.token'      : accessToken,
                    'google.name'       : profile.displayName,
                    'google.email'      : profile.emails[0].value,
                    'google.thumbnail'  : profile._json.picture
                });
                await newUser.save();
                console.log('New user created');
                done(null,newUser);
            }catch(e){
                done(e);
            }
        }
        else{
            console.log('HI');
            try{
                const user            = request.user;
                console.log(user);
                user.google.id        = profile.id;
                user.google.token     = accessToken;
                user.google.name      = profile.displayName;
                user.google.email     = profile.emails[0].value; 
                user.google.thumbnail = profile._json.picture;
                console.log(user);
                await user.save();
                done(null,user);
            }catch(e){
                done(e);
            }
        }
    })
);

passport.use('local-signup',new LocalStrategy({
    usernameField     : 'email',
    passwordField     : 'password',
    passReqToCallback : true,
}, async (request,email,password,done)=>{
    try{
        const {name,email,password,password2}   = request.body;
        if(password.length<6 || password2.length<6)
            return done(null,false,request.flash('signUpMessage','Password strength is weak'));
        if(password != password2)
            return done(null,false,request.flash('signUpMessage','Passwords do not match'));
        
        const user = await User.findOne({'local.email':email});
        if(user)
            return done(null,false,request.flash('signUpMessage','User already exists'));
        const newUser = new User({
            'local.email'    : email,
            'local.password' : password,
            'local.username' : name
        });
        await newUser.save();
        done(null,newUser);
    }catch(e){
        const error = e.message.split(':');
        done(null,false,request.flash('signUpMessage',error[2]));
    }
}));

passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},async (request,email,password,done)=>{
    try{
        const user = await User.findOne({'local.email':email});
        if(!user)
            return done(null,false,request.flash('logInMessage',"Sorry, we don't recognize this email."));
        const checkPass = await user.isValidPassword(password);
        if(!checkPass){
            return done(null,false,request.flash('logInMessage','Wrong password. Try again.'));   
        }
        done(null,user);
    }catch(e){
        done(null,false,request.flash('logInMessage','Error'));
    }
}));