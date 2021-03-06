// Third party components
import React, { useReducer, useEffect } from 'react'

// Custom components
import { validate } from '../../util/validators'
import './Input.css'

// The reducer function that serves as the callback function-argument to useReducer's 
const inputReducer = (state, action) => {
    switch(action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            }
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            }    
        default:
            return state;    
    }
}    


const Input = props => {
    // useReducer is preferred when dealing with more complex/INTERCONNECTED state
    const [inputState, dispatch] = useReducer(inputReducer, { value: props.value || "", isTouched: false, isValid: props.valid || false })

    // destructuring relevant pieces, so useEffect only fires when ONLY these change
    const { id, onInput} = props  
    const { value, isValid } = inputState
    
    // Side effect module
    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, onInput, value, isValid]) 

    
    const  changeHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        })
    } 


    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        })
    }

    const element = props.element === 'input' ? (
        <input 
            id={props.id} 
            type={props.type} 
            placeholder={props.placeholder} 
            onChange={changeHandler}
            onBlur={touchHandler}
            value={inputState.value}    
        /> 
    ) : (
        <textarea 
            id={props.id} 
            rows={props.rows || 3} 
            onChange={changeHandler}
            onBlur={touchHandler} 
            value={inputState.value}    
        />
    )   
        

    return (
        <div 
            className={`form-control ${!inputState.isValid  && inputState.isTouched && 'form-control--invalid'}`}
        >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    )
}

export default Input