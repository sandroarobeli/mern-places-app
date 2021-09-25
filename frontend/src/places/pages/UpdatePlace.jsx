// Third party components
import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

// Custom components
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import Card from '../../shared/components/UIElements/Card'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import './NewPlace.css'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'


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


const UpdatePlace = props => {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [loadedPlace, setLoadedPlace] = useState()
    const history = useHistory()
    // Since we have placeId in path of Router, useParams() has access to it!
    const placeId = useParams().placeId

    // NOTE 1.
    // REACT RULE: HOOKS MUST BE USED DIRECTLY INSIDE THE FUNCTION COMPONENT!
    // CANNOT BE USED "INSIDE-INSIDE" EXAMPLE: INSIDE IF BLOCKS, INSIDE THEN()
    // PROMISES ETC.
    
    // NOTE 2.
    // THIS useForm() INITIALIZES WITH DEFAULTS BEFORE SERVER CALL
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const data = await sendRequest(`http://127.0.0.1:5000/api/places/${placeId}`)
                setLoadedPlace(data.place)
                setFormData({
                    title: {
                        value: data.place.title,
                        isValid: true
                    },
                    description: {
                        value: data.place.description,
                        isValid: true
                    }
                }, true)
            } catch (error) {
                // Do nothing here, useHttpClient() handles errors
            }
        }

        fetchPlace()
     },[sendRequest, placeId, setFormData])

    
    const placeUpdateSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            await sendRequest(`http://127.0.0.1:5000/api/places/${placeId}`, 'PATCH', JSON.stringify({
                title:  formState.inputs.title.value,
                description: formState.inputs.description.value
            }), {
                'Content-Type': 'application/json',
            })
            history.push('/' + auth.userId + '/places')
        } catch (error) {
            // Do nothing here, useHttpClient() handles errors
        }
    }

    if (isLoading) {
        return (
            <div className='center'>
                <LoadingSpinner />
            </div>
        )
    }

    if (!loadedPlace && !error) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        )
    }

    
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && loadedPlace && <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid title.'
                    onInput={inputHandler}
                    value={loadedPlace.title} 
                    valid={true} 
                />
                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please enter a valid description. (min. of 5 characters).'
                    onInput={inputHandler}
                    value={loadedPlace.description} 
                    valid={true} 
                />
                <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>}
        </React.Fragment>
    )
}

export default UpdatePlace