// Third party components
import React, { useState, useContext } from 'react'

// Custom components
import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import './Auth.css'


const Auth = props => {
    // State management module
    const [isLoginMode, setIsLoginMode] = useState(true)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    // const [isLoading, setIsLoading] = useState(false)    ERROR & LOADING STATES
    // const [error, setError] = useState()                 ARE MANAGED INSIDE OF THE HTTP-HOOK 
    // auth object RE-renders whenever AuthContext changes
    const auth = useContext(AuthContext)



    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
            {
                ...formState.inputs,
                name: undefined // setting name property drops the name input from FORM 
            }, 
            formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevState => !prevState)
    }

    const authSubmitHandler = async event => {
        event.preventDefault()
        console.log(formState.inputs) //test for now
        
        

        if (isLoginMode) {
            try {
                const data = await sendRequest('http://127.0.0.1:5000/api/users/login', 'POST', JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value,
                    }),
                    {'Content-Type':'application/json'}
                )
                auth.login(data.user.id)
            } catch (error) {
                console.log(error.message)// test
            }
            
        } else {
            try {
                // fetch() is built in, no need to install and import it
                // An error is thrown ONLY if the request can't be sent
                const data = await sendRequest('http://127.0.0.1:5000/api/users/signup', 'POST', JSON.stringify({
                    name: formState.inputs.name.value,
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                    }),
                    {'Content-Type':'application/json'}
                )
                auth.login(data.user.id) // Updates application wide State to loggedIn(true)
            } catch (error) {
                console.log(error.message) 
            }
            
        }
    }


    return (
        <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        <Card className='authentication'>
            {isLoading && <LoadingSpinner asOverlay />}
            <h2>Login Required</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && <Input 
                                    element='input'
                                    id='name'
                                    type='text'
                                    label='Name'
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText='Please enter a name'
                                    onInput={inputHandler}
                                />
                    
                }
                <Input 
                    id='email' 
                    element='input' 
                    type='email' 
                    label='Email' 
                    validators={[VALIDATOR_EMAIL()]} 
                    errorText='Please enter a valid email address'
                    onInput={inputHandler}
                />
                <Input 
                    id='password' 
                    element='input' 
                    type='password' 
                    label='Password' 
                    validators={[VALIDATOR_MINLENGTH(6)]} 
                    errorText='Please enter a valid password. At least 6 characters.'
                    onInput={inputHandler}
                />
                <Button type='submit' disabled={!formState.isValid}>
                    {isLoginMode ? 'LOGIN' : 'SIGN UP'}
                </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>{isLoginMode ? 'SIGN UP' : 'LOGIN'}</Button>
        </Card>
        </React.Fragment>
    )
}

export default Auth