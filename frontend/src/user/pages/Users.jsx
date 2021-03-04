// Third party components
import React from 'react'

// Custom components
import UsersList from '../components/UsersList'

const Users = () => {

    // Temporary container for data
    const USERS = [
        {
            id: 'u1',
            name: 'Marillon Cotillard',
            image: 'https://ca-times.brightspotcdn.com/dims4/default/3875161/2147483647/strip/true/crop/381x512+0+0/resize/840x1129!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fde%2Faa%2F9fe6971fe714e7d9b79b5806a159%2Fsdut-file-in-this-may-21-2009-fil-20160829-002',
            places: 3
        },
        {
            id: "u2",
            name: "Olga Kurylenko",
            image:
                "https://tr-images.condecdn.net/image/4lKNoX16pYJ/crop/405/f/olga-kurylenko-conde-nast-traveller-2april15-getty_.jpg",
            places: 7
        }
    ]

    return (
        <UsersList items={USERS} />
    )
}

export default Users