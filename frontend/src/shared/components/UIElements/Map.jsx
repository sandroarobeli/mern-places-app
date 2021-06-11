// Third party components
import React, { useEffect, useState } from 'react'

// Mapbox specific imports
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Custom components
import './Map.css'

// Token initialization (Will be moved to .env eventually)
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FuZHJvYXJvYmVsaTc3IiwiYSI6ImNrZHF1c2ZxdzE4dzQyeW1oYXVuMjNnemcifQ.OQ4keea0vl2LcamSCT6UVQ";

// Map's styles. More available from Mapbox API
const street = "mapbox://styles/mapbox/streets-v11?optimize=true";
const satellite = "mapbox://styles/mapbox/satellite-streets-v11?optimize=true";


const Map = (props) => {
    // Destructuring objects and separating them into their own variables
    const gpsCoordinates = props.center
    let longitude = gpsCoordinates.lng
    let latitude = gpsCoordinates.lat
    const zoom = props.zoom

    
    // State management module
    const [view, setView] = useState(street)


    // Side effect module
    useEffect(() => {
        // Initialize the map object
        const map = new mapboxgl.Map({
            container: "map", 
            style: view, 
            center: [longitude, latitude],  // props.center = [longitude, latitude]
            zoom: zoom
        });
        
        // Add zoom and rotation controls to the map.
        map.addControl(new mapboxgl.NavigationControl());
        
        // Add user's dynamic active geolocation control
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
            })
        );

        // Create a default Marker and add it to the map.
        const marker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(gpsCoordinates)  // .setLngLat([longitude, latitude])
            .addTo(map);
    }, [longitude, latitude, zoom, view])
    
    
    // Change map view mode street vs. satellite
    const styleChangeHandler = (event) => {
        setView(event.target.value);
    };

    return (
        <React.Fragment>
            <div id="map" className={`map ${props.className}`} style={props.style}></div>
            <div id='view-options' className='view-options'>
                <input 
                    className='view-options__input'
                    id="satellite"
                    type="radio"
                    value={satellite}
                    onChange={styleChangeHandler}
                    checked={view === satellite}
                />
                <label htmlFor='satellite'>satellite</label>
                <input 
                    className='view-options__input'
                    id="streets"
                    type="radio"
                    value={street}
                    onChange={styleChangeHandler}
                    checked={view === street}
                />
                <label htmlFor='streets'>street</label>
            </div>
        </React.Fragment>
    )
}

export default Map