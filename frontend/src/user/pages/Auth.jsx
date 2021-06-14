// Third party components
import React, { useState, useContext } from 'react'

// Custom components
import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './Auth.css'


const Auth = props => {
    // State management module
    const [isLoginMode, setIsLoginMode] = useState(true)
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

    const authSubmitHandler = event => {
        event.preventDefault()
        console.log(formState.inputs) //test for now
        auth.login() // Updates application wide State to loggedIn(true)
    }

    return (
        <Card className='authentication'>
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
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorText='Please enter a valid password. At least 5 characters.'
                    onInput={inputHandler}
                />
                <Button type='submit' disabled={!formState.isValid}>
                    {isLoginMode ? 'LOGIN' : 'SIGN UP'}
                </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>{isLoginMode ? 'SIGN UP' : 'LOGIN'}</Button>
        </Card>
    )
}

export default Auth