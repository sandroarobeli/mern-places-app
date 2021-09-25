// Third party modules
import React from 'react'

// Custom modules
import Modal from './Modal'
import Button from '../FormElements/Button'

const ErrorModal = props => {
    return (
        <Modal
            onCancel={props.onClear}
            header='An Error occurred!'
            show={!!props.error}
            footer={<Button onClick={props.onClear}>Okay</Button>}
        >
            <p>{props.error}</p>
        </Modal>
    )
}

export default ErrorModal