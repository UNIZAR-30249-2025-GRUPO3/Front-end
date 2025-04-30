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
            <Modal.Header className="position-relative">
                <div className="position-absolute end-0 top-0 p-3">
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={onHide} 
                        aria-label="Close"
                    ></button>
                </div>
                <Modal.Title className="w-100 text-center">Espacio X</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
                <p>Contenido</p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button
                    variant="outline-light" 
                    onClick={() => {}} 
                    style={{
                        backgroundColor: '#000842',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '7px 16px',
                        width: 'auto',
                        minWidth: '120px'
                    }}
                >
                    Reservar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomPopup;
