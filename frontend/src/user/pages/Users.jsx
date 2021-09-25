// Third party components
import React, { useEffect, useState } from 'react'

// Custom components
import UsersList from '../components/UsersList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'


const Users = () => {
    // const [isLoading, setIsLoading] = useState(false)
    // const [error, setError] = useState()
    const [loadedUsers, setLoadedUsers] = useState([])
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    // Never use async inside useEffect callback function, use regular function as below
    // And create async function as axilliary and call it afterwords
    useEffect(() => {
       const fetchUsers = async () => {
           
           try {
                const data = await sendRequest('http://127.0.0.1:5000/api/users') 
                setLoadedUsers(data.users)
            } catch (error) {
                console.log(error.message) // test
            }
        }

       fetchUsers()
    }, [sendRequest])
    
    
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {
                isLoading && 
                    <div className='center'>
                        <LoadingSpinner />
                    </div>
            }
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />} 
        </React.Fragment>
    )
}

export default Users