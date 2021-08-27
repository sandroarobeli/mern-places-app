// Third party modules
const { validationResult } = require('express-validator')

// Custom modules
const HttpError = require('../models/http-error')
const getCoordinates = require('../utility/location')

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous buildings in the world',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th st, New York, NY, 10001',
        creator: 'u1'
    }
]

// List the place by its ID
const getPlaceById  = (req, res, next) => {
    const placeId = req.params.placeId
    const place = DUMMY_PLACES.find(place => place.id === placeId) // temporary
    
    if (!place) {
        // IN SYNCHRONOUS MODE USE next(error) OR throw new Error('some generic message'),
        // IN A-SYNCHRONOUS MODE ONLY USE return next(error)
        return next(new HttpError(`Place with ID: ${placeId} not found`, 404))
    }
    res.json({ place })
}

// List all places created by a given user
const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.userId
    const places = DUMMY_PLACES.filter(place => place.creator === userId)
    if (!places || places.length === 0) {
        // IN SYNCHRONOUS MODE USE next(error) OR throw new Error('some generic message'),
        // IN A-SYNCHRONOUS MODE ONLY USE return next(error)
        return next(new HttpError(`No places found for user ${userId}`, 404))
    }
    
    res.json({ places })
}

// Create a new Place
const createPlace = async (req, res, next) => {
    // Middleware registered in the routes gets invoked here
    // If returned errors object isn't empty, error is passed down the chain via next() 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.errors)//test
        return next(new HttpError('Invalid inputs entered. Please check your data', 422)) 
    }

    // Getting manually entered properties from the user request  
    const { title, description, address, creator } = req.body 
    
    // Getting coordinates by using geocoding function
    let coordinates  
    try {
        coordinates = await getCoordinates(address)
    } catch (error) {
        return next(error)
    }

    // combining all of above to create a new place
    const createdPlace = {
        title,
        description,
        location: coordinates,
        address,
        creator
    }
    DUMMY_PLACES.push(createdPlace)
    res.status(201).json({ place: createdPlace })   
}

// Update place
const updatePlaceById = (req, res, next) => {
    // Middleware registered in the routes gets invoked here
    // If returned errors object isn't empty, error is passed down the chain via next() 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.errors)//test
        return next(new HttpError('Invalid inputs entered. Please check your data', 422)) 
    }
    
    
    const placeId = req.params.placeId
    const { title, description } = req.body
    const updatedPlace = {...DUMMY_PLACES.find(place => place.id === placeId)}
    const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId)
    updatedPlace.title = title
    updatedPlace.description = description

    DUMMY_PLACES[placeIndex] = updatedPlace
    res.status(200).json({ place: updatedPlace })
}

// delete Place
const deletePlaceById = (req, res, next) => {
    const placeId = req.params.placeId
    // Place with given ID exists to begin with
    const placeExists = DUMMY_PLACES.find(place => place.id === placeId)
    if (!placeExists) {
        return next(new HttpError(`Place with ID ${placeId} not found`, 404))
    }
    // If so, delete it by filtering out of the array
    DUMMY_PLACES.filter(place => place.id !== placeId)
    res.status(200).json({ message: `Place with ID ${placeId} has been deleted`})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId 
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById