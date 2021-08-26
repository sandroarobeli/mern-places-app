// Third party modules
const express = require('express')

// Initializing the router object
const router = express.Router()

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
router.get('/:placeId', (req, res, next) => {
    const placeId = req.params.placeId
    const place = DUMMY_PLACES.find(place => place.id = placeId) // temporary
    res.json({ place })
})

// List all places created by a given user
router.get('/user/:userId', (req, res, next) => {
    const userId = req.params.userId
    const places = DUMMY_PLACES.filter(place => place.creator === userId)
    res.json({ places })
})


module.exports = router