// Third party modules
const express = require('express')

// Custom modules
const placesControllers = require('../controllers/places-controller')

// Initializing the router object
const router = express.Router()


// List the place by its ID
router.get('/:placeId', placesControllers.getPlaceById)

// List all places created by a given user
router.get('/user/:userId', placesControllers.getPlaceByUserId)

// Create a new Place
router.post('/', placesControllers.createPlace) 

// Update place
router.patch('/:placeId', placesControllers.updatePlaceById)

// delete Place
router.delete('/:placeId', placesControllers.deletePlaceById)

module.exports = router