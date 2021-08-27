// Third party modules
const express = require('express')

// Custom modules
const usersControllers = require('../controllers/users-controller')

// Initializing the router object
const router = express.Router()

// List all users
router.get('/', usersControllers.getUsers)

// Signup a new user
router.post('/signup', usersControllers.signup)

// Login an existing user
router.post('/login', usersControllers.login)

module.exports = router
