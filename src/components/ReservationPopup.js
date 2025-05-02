import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../css/CustomPopup.css';

const CustomPopup = ({ show, onHide }) => {

    const userRole = sessionStorage.getItem("userRole");

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
                <div>
                    <h5 className="mb-4 text-center">Detalles del espacio</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <table className="table table-sm table-striped table-bordered shadow-sm rounded">
                                <tbody>
                                    <tr>
                                        <th scope="row">Planta</th>
                                        <td>2ª</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Capacidad</th>
                                        <td>30 personas</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Tipo de espacio</th>
                                        <td>Aula</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Categoría de reserva</th>
                                        <td>Aula</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <table className="table table-sm table-striped table-bordered shadow-sm rounded">
                                <tbody>
                                    <tr>
                                        <th scope="row">Reservable</th>
                                        <td>Sí</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Asignado a</th>
                                        <td>EINA</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Uso máximo permitido</th>
                                        <td>80%</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Horario personalizado</th>
                                        <td>No (usa el del edificio)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center gap-5">
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

                {userRole === "gerente" && (
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
                        Cambiar info
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default CustomPopup;
