import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/CustomPopup.css';

const CustomPopup = ({ show, onHide }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            dialogClassName="custom-modal"
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Popup</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
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
