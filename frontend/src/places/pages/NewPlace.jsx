// Third party components
import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

// Custom components
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import './NewPlace.css'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'


const NewPlace = () => {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
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

     const history = useHistory()

    const placeSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            await sendRequest('http://127.0.0.1:5000/api/places', 'POST', JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
            address: formState.inputs.address.value,
            creator: auth.userId
            }),
            { 'Content-Type' : 'application/json' }
            )
            console.log(formState.inputs) // test
            // Redirect the user to a starting page
            history.push('/')
        } catch (error) {
            // Do nothing extra here, error case is handled inside useHttpClient() hook
        }
    }
    
    return (
        <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <form className='place-form' onSubmit={placeSubmitHandler}>
            {isLoading && <LoadingSpinner asOverlay/>}
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
        </React.Fragment>
    )
}

export default NewPlace