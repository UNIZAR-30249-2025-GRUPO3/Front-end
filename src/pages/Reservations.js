import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FiCalendar, FiTrash2 } from 'react-icons/fi';
import CustomNavbar from '../components/CustomNavbar';
import CustomModal from '../components/CustomModal';
import Pagination from "../components/CustomPagination";
import 'bootstrap/dist/css/bootstrap.min.css';

const Reservations = () => {
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reservationsPerPage = 5;

    //  DATOS PARA PRUEBAS, LUEGO ESTO SE SACA DE LA API ****************************
    const data = [
        {
            id: 1,
            spaceId: "X",
            userName: "Paco González",
            category: "aula",
            usageType: "docencia",
            maxAttendees: 30,
            startTime: new Date("2025-04-26T08:00:00"),
            duration: 90,
        },
        {
            id: 2,
            spaceId: "X",
            userName: "Carlos Martínez",
            category: "seminario",
            usageType: "investigacion",
            maxAttendees: 20,
            startTime: new Date("2025-04-26T10:00:00"),
            duration: 60,
        },
        {
            id: 3,
            spaceId: "X",
            userName: "María Pérez",
            category: "laboratorio",
            usageType: "gestion",
            maxAttendees: 15,
            startTime: new Date("2025-04-26T11:00:00"),
            duration: 120,
        },
        {
            id: 4,
            spaceId: "X",
            userName: "Luis Rodríguez",
            category: "sala común",
            usageType: "otro",
            maxAttendees: 10,
            startTime: new Date("2025-04-26T13:00:00"),
            duration: 45,
        },
        {
            id: 5,
            userName: "Sofía Ramírez",
            category: "aula",
            usageType: "docencia",
            maxAttendees: 25,
            startTime: new Date("2025-04-26T14:00:00"),
            duration: 90,
        },
        {
            id: 6,
            spaceId: "X",
            userName: "Paco González",
            category: "seminario",
            usageType: "investigacion",
            maxAttendees: 20,
            startTime: new Date("2025-04-27T08:00:00"),
            duration: 60,
        },
        {
            id: 7,
            spaceId: "X",
            userName: "Carlos Martínez",
            category: "laboratorio",
            usageType: "gestion",
            maxAttendees: 15,
            startTime: new Date("2025-04-27T09:00:00"),
            duration: 120,
        },
        {
            id: 8,
            spaceId: "X",
            userName: "María Pérez",
            category: "sala común",
            usageType: "otro",
            maxAttendees: 10,
            startTime: new Date("2025-04-27T11:00:00"),
            duration: 45,
        },
        {
            id: 9,
            spaceId: "X",
            userName: "Luis Rodríguez",
            category: "aula",
            usageType: "docencia",
            maxAttendees: 25,
            startTime: new Date("2025-04-27T12:00:00"),
            duration: 90,
        },
    ];

    data.forEach(reservation => {
        reservation.endTime = new Date(reservation.startTime.getTime() + reservation.duration * 60000);
    });

    const handleDeleteClick = (user) => {
        setSelectedReservation(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReservation(null);
    };

    const totalPages = Math.ceil(data.length / reservationsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const indexOfLastReservatio = currentPage * reservationsPerPage;
    const indexOfFirstReservatio = indexOfLastReservatio - reservationsPerPage;
    const currentReservatios = data.slice(indexOfFirstReservatio, indexOfLastReservatio);

    return (
        <div className="App position-relative d-flex flex-column" style={{ height: '100vh' }}>
            <CustomNavbar />
            <Container className="mt-4 flex-grow-1 d-flex flex-column">
                <Row className="d-flex justify-content-center text-center mb-3">
                    <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                        <div className="rounded-circle img-fluid me-3" style={{ width: "100px", height: "100px" }}>
                            <FiCalendar
                                size={75}
                                style={{ overflow: "visible" }}
                            />
                        </div>
                        <div>
                            <h2 className="mb-1 text-center">Mis reservas</h2> 
                            <p className="text-muted text-start">Tienes {data.length} reservas</p> 
                        </div>
                    </Col>
                </Row>
                <div className="flex-grow-1 overflow-auto p-3"
                    style={{
                        flexGrow: 1,
                        minHeight: '200px',
                        maxHeight: 'calc(100vh - 280px)',
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                    }}>
                    <Row>
                        {currentReservatios.map(user => (
                            <Col xs={12} key={user.id} className="mb-3">
                                <div
                                    className="d-flex w-100 p-3"
                                    style={{
                                        backgroundColor: '#D6EAFF',
                                        border: '0.5px solid #ddd',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                                        borderRadius: '10px',
                                        marginLeft: '10px',
                                        minHeight: '100px',
                                    }}
                                    >
                                    <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                        <div className="d-flex flex-wrap mb-2">
                                        <span className="fw-bold fs-5 text-capitalize me-2">
                                            {user.category} {user.spaceId}
                                        </span>
                                        </div>
                                        <div className="d-flex flex-wrap">
                                        <div className="me-4 mb-2"><strong>Tipo de Uso:</strong> {user.usageType}</div>
                                        <div className="me-4 mb-2"><strong>Asistentes Máx.:</strong> {user.maxAttendees}</div>
                                        <div className="me-4 mb-2"><strong>Inicio:</strong> {user.startTime?.toLocaleString()}</div>
                                        <div className="me-4 mb-2"><strong>Duración:</strong> {user.duration} min</div>
                                        <div className="me-4 mb-2"><strong>Fin:</strong> {user.endTime?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center ms-3">
                                        <Button
                                        variant="outline-light"
                                        className="d-flex align-items-center justify-content-center"
                                        onClick={() => handleDeleteClick(user)}
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: '6px',
                                            padding: '8px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        }}
                                        >
                                        <FiTrash2 style={{ color: 'red', fontSize: '20px' }} />
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className="pt-3 pb-2">
                    <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                </div>
            </Container>
            <CustomModal
                show={showModal}
                onHide={handleCloseModal}
                title={selectedReservation ? `Cancelar reserva del ${selectedReservation.category} ${selectedReservation.spaceId}` : "Cancelar reserva"}
                bodyText={selectedReservation ? `¿Estás seguro que deseas cancelar la reserva del ${selectedReservation.category} ${selectedReservation.spaceId} con fecha de inicio: ${selectedReservation.startTime?.toLocaleString()}?`
                    : "¿Estás seguro que deseas cancelar la reserva?"}
                confirmButtonText="Cancelar reserva"
                onSave={handleCloseModal}
            />
        </div>
    );
};

export default Reservations;