import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomPopup = ({ show, onHide }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Popup</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Contenido</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomPopup;
