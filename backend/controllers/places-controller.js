// Third party modules
const { validationResult } = require('express-validator')

// Custom modules
const HttpError = require('../models/http-error')
const getCoordinates = require('../utility/location')
const Place = require('../models/place-model')


// List the place by its ID
const getPlaceById  = async (req, res, next) => {
    const placeId = req.params.placeId
    try {
        const place = await Place.findById(placeId)
        if (!place) {
            // IN SYNCHRONOUS MODE USE next(error) OR throw new Error('some generic message'),
            // IN A-SYNCHRONOUS MODE ONLY USE return next(error)
            return next(new HttpError(`Place with ID: ${placeId} not found`, 404))
        }
        // adds id property (in addition to _id) to the returned Object
        res.status(200).json({ place: place.toObject({ getters: true }) }) 
    } catch (error) {
        return next(new HttpError(`Unable to retrieve Place: ${error.message}`, 500))
    }    
    
}

// List all places created by a given user
const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId
    try {
        const places = await Place.find({ creator: userId })
        if (!places || places.length === 0) {
            // IN SYNCHRONOUS MODE USE next(error) OR throw new Error('some generic message'),
            // IN A-SYNCHRONOUS MODE ONLY USE return next(error)
            return next(new HttpError(`No places found for user ${userId}`, 404))
        }
        // adds id property (in addition to _id) to the returned Object(s)
        res.status(200).json({ places: places.map(place => place.toObject({ getters: true })) })
    } catch (error) {
        return next(new HttpError(`Unable to retrieve places: ${error.message}`, 500))
    }
}

// Create a new Place
const createPlace = async (req, res, next) => {
    // Middleware registered in the routes gets invoked here
    // If returned errors object isn't empty, error is passed down the chain via next()
    // THIS TRY-CATCH ENSURES PROCESSING OF INPUT PROPERTIES 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.errors)//test
        return next(new HttpError('Invalid inputs entered. Please check your data', 422)) 
    }

    // Getting manually entered properties from the user request  
    const { title, description, image, address, creator } = req.body 
    
    // Getting coordinates by using geocoding function
    // THIS TRY-CATCH ENSURES PROCESSING OF ADDRESS --> COORDINATES CONVERSION
    let coordinates  
    try {
        coordinates = await getCoordinates(address)
    } catch (error) {
        return next(error)
    }

    // combining all of above to create a new place
    const createdPlace = new Place({
        title,
        description,
        image,
        location: coordinates,
        address,
        creator
    })
    // THIS TRY-CATCH ENSURES PROPER NETWORK PROTOCOL EXCHANGE
    try {
        await createdPlace.save()
        res.status(201).json({ place: createdPlace.toObject({ getters: true }) })   
    } catch (error) {
        return next(new HttpError(`Creating Place failed: ${error.message}`, 500))
    }
    
}

// Update place
const updatePlaceById = async (req, res, next) => {
    // Middleware registered in the routes gets invoked here
    // If returned errors object isn't empty, error is passed down the chain via next() 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.errors)//test
        return next(new HttpError('Invalid inputs entered. Please check your data', 422)) 
    }
    
    
    const placeId = req.params.placeId
    const { title, description } = req.body
    
    try {
        const updatedPlace = await Place.findByIdAndUpdate(
            placeId,
            { title, description },
            { new: true }
        )
        if (!updatedPlace) {
            return next(new HttpError(`Place with ID: ${placeId} not found`, 404))
        }
        res.status(200).json({ place: updatedPlace.toObject({ getters: true }) })
    } catch (error) {
        return next(new HttpError(`Updating Place failed: ${error.message}`, 500))
    }
}

// delete Place
const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.placeId
    try {
        const deletedPlace = await Place.findByIdAndDelete(placeId)
        if (!deletedPlace) {
            return next(new Error(`Place with ID: ${placeId} not found`, 404))
        }
        res.status(200).json({ message: `${deletedPlace.title} has been successfully deleted`})
    } catch (error) {
        return next(new HttpError(`Deleting Place failed: ${error.message}`, 500))
    }
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId 
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById