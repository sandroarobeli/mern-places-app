// Third party modules
import { useState, useCallback, useRef, useEffect } from 'react'

// Custom hook that handles sending requests and managing state
// useCallback ensures this function(sendRequest) never gets re-created when the component that
// uses this hook re-renders! Thus avoiding infinite loops. Applies to every hook
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    // In case we navigate to a new page while request is still pending
    // We can get an error. To avoid it, we store data across re-render cycles
    const activeHttpRequests = useRef([])

    // Send request function (useCallback ensures function only runs once, there is no infinite loops)
    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers ={}) => {
        setIsLoading(true)

        // This is an API supported in modern browsers
        // useState can also manage it, but we use it behind the scenes so we use useRef
        const httpAbortController = new AbortController()
        activeHttpRequests.current.push(httpAbortController)

        try {
            const response = await fetch(url, {
                method,
                headers,
                body,
                signal: httpAbortController.signal
            })
            const data = await response.json()

            // IMPORTANT: ACTIVATE THIS CODE IF ERRORS OCCUR
            // activeHttpRequests.current = activeHttpRequests.current.filter(requestController => requestController !== httpAbortController)

            // Error ISN'T thrown in catch, but response has 400 or 500 status code in it
            if (!response.ok) {
                throw new Error(data.message)
            }
            console.log(data) // test
            setIsLoading(false)
            return data

        } catch (error) {
            setError(error.message || 'Something went wrong. Please try again later')
            setIsLoading(false)
            throw error // Stops execution
        }
        
    }, [])

    // Clear error function 
    const clearError = () => {
        setError(null)
    }

    // Run some clean up logic when a component unmounts,
    // for that we return a function that cleans up
    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortController => abortController.abort())
        }
    }, [])

    return { isLoading, error, sendRequest, clearError }
}