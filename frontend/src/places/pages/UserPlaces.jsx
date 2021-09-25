// Third party components
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// Custom components
import PlaceList from '../components/PlaceList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'


const UserPlaces = () => {
    // useParams gives us access to the parameters (dynamic segments)
    // they are properties of the object the useParams() returns
    const userId = useParams().userId
    const [loadedPlaces, setLoadedPlaces] = useState([])
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const data = await sendRequest(`http://127.0.0.1:5000/api/places/user/${userId}`)
                setLoadedPlaces(data.places)
                console.log("USER'S PLACES:")// test
                console.log(loadedPlaces) // test
            } catch (error) {
                // Do nothing here, useHttpClient() handles errors
            }
        }

        fetchPlaces()
    }, [sendRequest, userId]) // this way, it only renders once, when component is mounted
  
    const placeDeleteHandler = (deletedPlaceId) => {
        setLoadedPlaces(prevState => prevState.filter(place => place.id !== deletedPlaceId))
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className='center'><LoadingSpinner /></div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
        </React.Fragment>
    )
}

export default UserPlaces
