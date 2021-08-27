// Custom modules
const HttpError = require('../models/http-error')


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
const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.userId
    const places = DUMMY_PLACES.filter(place => place.creator === userId)
    if (!places || places.length === 0) {
        // IN SYNCHRONOUS MODE USE next(error) OR throw new Error('some generic message'),
        // IN A-SYNCHRONOUS MODE ONLY USE return next(error)
        return next(new HttpError(`No places found`, 404))
    }
    
    res.json({ places })
}

// Create a new Place
const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body 
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
    DUMMY_PLACES.filter(place => place.id !== placeId)
    res.status(200).json({ message: `Place with ID ${placeId} has been deleted`})
}

exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId 
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById