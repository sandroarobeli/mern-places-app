// Third party modules
const express = require('express')
const cors = require('cors')

// Database module 


// Custom modules
const usersRoutes = require('./routes/users-routes')  // Users router
const placesRoutes = require('./routes/places-routes')  // Places router

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


// Start the server
app.listen(port, (error) => {
    if (error) {
        return console.log(error)
    }
    console.log(`Server running on port: ${port}`)
})