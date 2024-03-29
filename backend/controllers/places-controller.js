// Third party modules
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')

// Custom modules
const HttpError = require('../models/http-error')
const getCoordinates = require('../utility/location')
const Place = require('../models/place-model')
const User = require('../models/user-model')

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

// List all places created by a given user // USE THIS CONTROLLER IN MUI VERSION
const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId
    try {
        const places = await Place.find({ creator: userId })
        if (places.length === 0) {
            // IN SYNCHRONOUS MODE USE next(error) OR throw new Error('some generic message'),
            // IN A-SYNCHRONOUS MODE ONLY USE return next(error)
            // NOTE: NO ERROR NEEDED HERE, THIS IS NOT AN ERROR. SIMPLY NO PLACES EXIST
            return next(new HttpError(`No places found for this user`, 404))
           
        }
        // adds id property (in addition to _id) to the returned Object(s)
        res.status(200).json({ places: places.map(place => place.toObject({ getters: true })) })
    } catch (error) {
        return next(new HttpError(`Unable to retrieve places: ${error.message}`, 500))
    }
}

// List all places created by a given User II (ALTERNATIVE VERSION)
const getPlacesByUserId2 = async (req, res, next) => {
    const userId = req.params.userId
    try {
        user = await User.findById(userId).populate('places')
        if (!user) {
            return next(new HttpError('User not found', 404))
        }
        else if (user.places.length === 0) {
            return next(new HttpError('No places found this User', 404))
        }
        res.status(200).json({ places: user.places.map(place => place.toObject({ getters: true }))})
    } catch (error) {
        return next(new HttpError(`Fetching places for this User failed: ${error.message}`, 500))
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
    const { title, description, address, creator } = req.body // ADD image PROP HERE!!! 
    
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
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/ba/d8/83/exterior.jpg?w=900&h=-1&s=1",
        location: coordinates,
        address,
        creator
    })

    // This block ensures that only existing user can create a new place
    let user
    try {
        user = await User.findById(creator)
        if (!user) {
            return next(new HttpError('Creating Place failed. Corresponding User not found', 404))
        }
    } catch (error) {
        return next(new HttpError(`Creating Place failed: ${error.message}`, 500))
    }

    // THIS TRY-CATCH ENSURES PROPER NETWORK PROTOCOL EXCHANGE
    try {
        // Transactions let you execute multiple operations 
        // In isolation and potentially undo all the operations if one of them fails.
        const session = await mongoose.startSession()
        
        // Begin Transaction
        session.startTransaction()
        await createdPlace.save({ session: session })
        user.places.push(createdPlace) // This push method is unique to mongoose. Adds placeId to user
        await user.save({ session: session })
        await session.commitTransaction()
        // End Transaction

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
    let deletedPlace
    try {
        // Makes full User object available via Place
        deletedPlace = await Place.findById(placeId).populate('creator') 
        if (!deletedPlace) {
            return next(new Error(`Place with ID: ${placeId} not found`, 404))
        }
    } catch (error) {
        return next(new HttpError(`Deleting Place failed: ${error.message}`, 500))
    }

    try {
        const session = await mongoose.startSession()
        // Begin Transaction
        session.startTransaction()
        await deletedPlace.remove({ session: session })
        deletedPlace.creator.places.pull(deletedPlace) // This pull method is unique to mongoose. Removes placeId from user
        await deletedPlace.creator.save({ session: session })
        await session.commitTransaction()
        // End Transaction

        res.status(200).json({ message: `${deletedPlace.title} has been successfully deleted`})
    } catch (error) {
        return next(new HttpError(`Deleting Place failed: ${error.message}`, 500))
    }
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.getPlacesByUserId2 = getPlacesByUserId2 
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById