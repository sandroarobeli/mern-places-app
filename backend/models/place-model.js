// Third party modules
const mongoose = require('mongoose')
// validator?

// Define Place Schema
const placeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        lng: {
            type: Number,
            required: true
        },
        lat: {
            type: Number,
            required: true
        }
    },
    creator: { // will be replaced with refs(ObjectId) etc...)
        type: String,
        required: true,
        trim: true // remove if interferes with refs etc.
    }
})

// Define Place class per its Schema (Blueprint)
const Place = mongoose.model('Place', placeSchema)

module.exports = Place