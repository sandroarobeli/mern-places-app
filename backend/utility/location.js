// Third party modules
const axios = require('axios')

// Custom modules
const HttpError = require('../models/http-error')

const API_KEY = 'pk.eyJ1Ijoic2FuZHJvYXJvYmVsaTc3IiwiYSI6ImNrZHF1c2ZxdzE4dzQyeW1oYXVuMjNnemcifQ.OQ4keea0vl2LcamSCT6UVQ'

const getCoordinates = async (address) => {
    try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${API_KEY}`)

        const coordinates = response.data.features[0].geometry.coordinates
        console.log(coordinates)        // test
        return {
            lng: coordinates[0],
            lat: coordinates[1]
        }
    } catch (error) {
       const errorMessage = error.response //.data 
            ? error.response.data.message 
            : 'Could not find location for the address entered. Please check the address and enter it again'
       const errorStatus = error.response 
            ? error.response.status
            : 500   
        throw new HttpError(errorMessage, errorStatus)
    }
}

module.exports = getCoordinates