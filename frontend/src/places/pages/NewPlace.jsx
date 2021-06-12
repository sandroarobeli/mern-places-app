// Third party components
import React from 'react'

// Custom components
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import './NewPlace.css'
import { useForm } from '../../shared/hooks/form-hook'



const NewPlace = () => {

    // REACT RULE: HOOKS MUST BE USED DIRECTLY INSIDE THE FUNCTION COMPONENT!
    // CANNOT BE USED "INSIDE-INSIDE" EXAMPLE: INSIDE IF BLOCKS, INSIDE THEN()
    // PROMISES ETC.
    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        }
    }, false)

     

    const placeSubmitHandler = event => {
        event.preventDefault()
        // Sends the payload to server...
        console.log(formState.inputs) // test
    }
    
    return (
        <form className='place-form' onSubmit={placeSubmitHandler}>
            <Input 
                id='title'
                type='text' 
                label='Title' 
                element='input' 
                validators={[VALIDATOR_REQUIRE()]} 
                errorText='Please enter a valid title.'
                onInput={inputHandler} 
            />
            <Input 
                id='description' 
                label='Description' 
                element='textarea' 
                validators={[VALIDATOR_MINLENGTH(5)]} 
                errorText='Please enter a valid description. (At least 5 characters).'
                onInput={inputHandler} 
            />
            <Input 
                id='address' 
                label='Address' 
                element='input' 
                validators={[VALIDATOR_REQUIRE()]} 
                errorText='Please enter a valid address.'
                onInput={inputHandler} 
            />
            <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
        </form>
    )
}

export default NewPlace