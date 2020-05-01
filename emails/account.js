const sgMail = require('@sendgrid/mail');
const keys   = require('../config/keys');

sgMail.setApiKey(keys.sendgrid.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name) => {
    console.log(email);
    console.log(name);
    sgMail.send({
        to      :  email,
        from    : 'mayanklal08@icloud.com',
        subject : 'Welcome to vintage tech',
        html    : `Welcome to the app, <i>${name}</i>. Let us know how you get along with the app.`
    });
}

module.exports=sendWelcomeEmail;