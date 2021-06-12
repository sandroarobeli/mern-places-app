// Third party components
import React, { useReducer } from 'react'
import { useParams } from 'react-router-dom'

// Custom components
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import './NewPlace.css'
import { useForm } from '../../shared/hooks/form-hook'

const formReducer = (state, action) => {
    switch(action.type) {
        case 'INPUT_CHANGE':
        let formIsValid = true    
        for (const inputId in state.inputs) {
            if (inputId === action.inputId) {
                formIsValid = formIsValid && action.isValid
            } else {
                formIsValid = formIsValid && state.inputs[inputId].isValid
            }
        }
        return {
            ...state,
            inputs: {
                ...state.inputs,
                [action.inputId]: { value: action.value, isValid: action.isValid }
            },
            isValid: formIsValid
        }
        default:
            return state    
    }
}

const DUMMY_PLACES = [
    {
       id: 'p1',
       title: 'Empire state building',
       description: 'One of the most skyscrapers in the world',
       imageUrl: 'https://media.istockphoto.com/photos/new-york-city-skyline-picture-id486334510?k=6&m=486334510&s=612x612&w=0&h=qMsSuzsZcCtSEZyhnEsJsQvRSx-feldCQAOR9D9mVas=',
       address: '20 W 34th St, New York, NY 10001',
       creator: 'u1',
       location: {
           lat: 40.7484,
           lng: -73.9857
       }

    },{
       id: 'p2',
       title: 'Leaning tower of Pisa',
       description: 'Leaning tower structure in the city of Pisa,Italy',
       imageUrl: 'https://cdn.britannica.com/88/80588-050-8D944BFE/Leaning-Tower-of-Pisa-Italy.jpg',
       address: 'Piazza del Duomo, 56126 Pisa PI, Italy',
       creator: 'u1',
       location: {
           lat: 43.7230,
           lng: 10.3966
       }
    },{
       id: 'p3',
       title: 'Le Louvre',
       description: 'The Louvre museum in Paris, France',
       imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Louvre_Courtyard%2C_Looking_West.jpg/805px-Louvre_Courtyard%2C_Looking_West.jpg',
       address: 'Rue de Rivoli, 75001 Paris, France',
       creator: 'u2',
       location: {
           lat: 48.8606,
           lng: 2.3376
       }
    }
]


const UpdatePlace = props => {
    // Since we have placeId in path of Router, useParams() has access to it!
    const placeId = useParams().placeId

    const identifiedPlace = DUMMY_PLACES.find(place => place.id === placeId)

    
    // REACT RULE: HOOKS MUST BE USED DIRECTLY INSIDE THE FUNCTION COMPONENT!
    // CANNOT BE USED "INSIDE-INSIDE" EXAMPLE: INSIDE IF BLOCKS, INSIDE THEN()
    // PROMISES ETC.
    const [formState, inputHandler] = useForm({
        title: {
            value: identifiedPlace.title,
            isValid: true
        },
        description: {
            value: identifiedPlace.description,
            isValid: true
        }
    }, true)

    
    const placeUpdateSubmitHandler = event => {
        event.preventDefault()
        // Sends the payload to server...
        console.log(formState.inputs) // test
    }

    if (!identifiedPlace) {
        return (
            <div className='center'>
                <h2>Could not find place!</h2>
            </div>
        )
    }

    return (
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <Input 
                id='title' 
                element='input' 
                type='text' 
                label='Title' 
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid title.'
                onInput={inputHandler}
                value={formState.inputs.title.value} // THIS REFERS TO INITIAL VALUE
                valid={formState.inputs.title.isValid} // THIS REFERS TO INITIAL VALID
            />
            <Input 
                id='description' 
                element='textarea' 
                label='Description' 
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText='Please enter a valid description. (min. of 5 characters).'
                onInput={inputHandler}
                value={formState.inputs.description.value} // THIS REFERS TO INITIAL VALUE
                valid={formState.inputs.description.isValid} // THIS REFERS TO INITIAL VALID
            />
            <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>
    )
}

export default UpdatePlace