// Third party modules
const sgMail = require('@sendgrid/mail')
require("dotenv").config();

// Custom modules
const HttpError = require('../models/http-error')

// Initializing sendGridMail object with API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/*
// Generate welcome email upon creating a new user (Async)
const sendWelcomeEmail = async (name, email) => {
    try {
        sgMail.send({
            to: email,
            from: 'sandroarobeli77@gmail.com',
            subject: `Welcome to Places App ${name}`,
            // TRY HTML TEMPLATE VERSIONS LATER!!!
            text: `Welcome to Places App ${name}\nUsing this app, you can add, edit and remove places you find memorable.\nEnjoy!\nPlaces-App team`  
        })
    } catch (error) {
        return next(new HttpError(`Email sending failed: ${error.message}`, 500))
    }
}
*/
// Generate welcome email upon creating a new user
const sendWelcomeEmail = (name, email) => {
    sgMail.send({
            to: email,
            from: 'sandroarobeli77@gmail.com',
            subject: `Welcome to Places App ${name}`,
            // TRY HTML TEMPLATE VERSIONS LATER!!!
            text: `Welcome to Places App ${name}\nUsing this app, you can add, edit and remove places you find memorable.\nEnjoy!\nPlaces-App team`  
    })
    console.log(`Email to ${name} has been sent!`)//test
}

/*
// Generate follow up email upon deleting a user (Async)
const sendPartingEmail = async (name, email) => {
    try {
        sgMail.send({
            to: email,
            from: 'sandroarobeli77@gmail.com',
            subject: `Sorry to see you go ${name}`,
            text: `We are sorry to see you deleting your account at Places-App.\nWe would welcome your feedback with suggestions on how we can improve your user experience.\nFeel free to sign up again in the future.\nPlaces-App team`
        })
        console.log('sorry to see you go' + name)// test
    } catch (error) {
        console.log('sending email failed') // test
        return next(new HttpError(`Email sending failed: ${error.message}`, 500))
    }
}
*/

// Generate follow up email upon deleting a user
const sendPartingEmail = (name, email) => {
    sgMail.send({
            to: email,
            from: 'sandroarobeli77@gmail.com',
            subject: `Sorry to see you go ${name}`,
            text: `We are sorry to see you deleting your account at Places-App.\nWe would welcome your feedback with suggestions on how we can improve your user experience.\nFeel free to sign up again in the future.\nPlaces-App team`
        })
        console.log('sorry to see you go ' + name)// test
}

exports.sendWelcomeEmail = sendWelcomeEmail
exports.sendPartingEmail = sendPartingEmail