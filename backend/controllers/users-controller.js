// Third party modules
const { validationResult } = require('express-validator')

// Custom modules
const HttpError = require('../models/http-error')


const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Olga Kurilenko',
        email: 'ok@test.com',
        password: 'testers'
    }
]

// List all users
const getUsers = (req, res, next) => {
    res.status(200).json({ users: DUMMY_USERS })
}

// Signup a new user
const signup = (req, res, next) => {
    // Middleware registered in the routes gets invoked here
    // If returned errors object isn't empty, error is passed down the chain via next() 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.errors)//test
        return next(new HttpError('Invalid inputs entered. Please check your data', 422)) 
    }

    const { name, email, password } = req.body

    const hasUser = DUMMY_USERS.find(user => user.email === email)
    if (hasUser) {
        return next(new HttpError('This email already exists. Please choose another email', 422))
    }

    const createdUser = { name, email, password }
    DUMMY_USERS.push(createdUser)
    res.status(201).json({ user: createdUser })
}

// Login an existing user
const login = (req, res, next) => {
    const { email, password } = req.body

    const identifiedUser = DUMMY_USERS.find(user => user.email === email)
    if (!identifiedUser || identifiedUser.password !== password) {
        return next(new HttpError('Invalid credentials. User not found', 401))
    }
    res.json({ message: 'User logged in' })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login