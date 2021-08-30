// Third party modules
const express = require('express')
const cors = require('cors')

// Database module 
require('./db/mongoose')

// Custom modules
const usersRoutes = require('./routes/users-routes')  // Users router
const placesRoutes = require('./routes/places-routes')  // Places router
const HttpError = require('./models/http-error')

// Create the server app and designate the port
const app = express()
const port = process.env.port || 5000

// Register middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Register individual custom routers (NOTE: In case of app.USE(), the path doesn't have to be matched exactly)
app.use('/api/places', placesRoutes)  // ( It only has to start with it, example: /api/places/new also works)
app.use('/api/users', usersRoutes)

// Handling Errors for unsupported routes
app.use((req, res, next) => {
    const error = new HttpError('Route not found', 404)
    throw error // Since this is synchronous, we can use throw format
})

// Register error handling middleware
// If middleware function has 4 parameters, express will recognize it as a special ERROR handling middleware
// meaning it will only be executed on requests that throw (contain) errors
app.use((error, req, res, next) => {
    // if response has been sent
    if (res.headerSent) {
        return next(error)
    }
    // otherwise and if error object exists, it may have status code in it or default to 500
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred' })
})

// Start the server
app.listen(port, (error) => {
    if (error) {
        return console.log(error)
    }
    console.log(`Server running on port: ${port}`)
})