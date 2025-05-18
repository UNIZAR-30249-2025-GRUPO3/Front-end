import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FiCalendar, FiTrash2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import CustomModal from '../components/CustomModal';
import Pagination from "../components/CustomPagination";
import 'bootstrap/dist/css/bootstrap.min.css';

const Reservations = () => {

    const { userRole } = useAuth();

    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMyReservations, setShowMyReservations] = useState(true);
    const [showActiveReservations, setShowActiveReservations] = useState(false);

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
            invalid: false,
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
            invalid: false,
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
            invalid: true,
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
            invalid: false,
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
            invalid: false,
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
            invalid: true,
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
            invalid: true,
        },
        {
            id: 9,
            spaceId: "X",
            userName: "Luis Rodríguez",
            category: "aula",
            usageType: "docencia",
            maxAttendees: 25,
            startTime: new Date("2025-05-10T12:00:00"),
            duration: 90,
            invalid: false,
        },
    ];

    data.forEach(reservation => {
        reservation.endTime = new Date(reservation.startTime.getTime() + reservation.duration * 60000);
    });

    const now = new Date();
    const activeReservations = data.filter(reservation => reservation.endTime > now);

    const handleCancelClick = (user) => {
        setSelectedReservation(user);
        setShowCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setSelectedReservation(null);
    };

    const handleApproveClick = (user) => {
        setSelectedReservation(user);
        setShowApproveModal(true);
    };
      
    const handleCloseApproveModal = () => {
        setShowApproveModal(false);
        setSelectedReservation(null);
    };

    const toggleMyReservations = () => {
        setShowMyReservations(!showMyReservations);
        setShowActiveReservations(false); 
    };

    const showOnlyActiveReservations = () => {
        setShowActiveReservations(!showActiveReservations);
        setCurrentPage(1);
    };



    const displayedData = showActiveReservations ? activeReservations : data;

    const totalPages = Math.ceil(displayedData.length / reservationsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const indexOfLastReservatio = currentPage * reservationsPerPage;
    const indexOfFirstReservatio = indexOfLastReservatio - reservationsPerPage;
    const currentReservatios = displayedData.slice(indexOfFirstReservatio, indexOfLastReservatio);

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
                            <h2 className="mb-1 text-center">
                                {showMyReservations ? "Mis reservas" : "Todas las reservas"}
                                {showActiveReservations && " (Activas)"}
                            </h2> 
                            <p className="text-muted text-start">
                                Tienes {displayedData.length} {displayedData.length === 1 ? 'reserva' : 'reservas'}
                                {showActiveReservations ? ' activa' + (displayedData.length === 1 ? '' : 's') : ''}
                            </p>
                        </div>
                    </Col>
                </Row>
                <div className="flex-grow-1 overflow-auto p-3"
                    style={{
                        flexGrow: 1,
                        minHeight: '200px',
                        maxHeight: 'calc(100vh - 290px)',
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
                                        backgroundColor: user.invalid ? '#FFD6D6' : '#D6EAFF',
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
                                            {user.invalid && (
                                                <span className="fw-normal fs-6"> - (Reserva potencialmente inválida)</span>
                                            )}
                                        </span>
                                        </div>
                                        <div className="d-flex flex-wrap">
                                        {!showMyReservations && (
                                            <div className="me-4 mb-2">
                                                <strong>Usuario:</strong> {user.userName}
                                            </div>
                                        )}
                                        <div className="me-4 mb-2"><strong>Tipo de Uso:</strong> {user.usageType}</div>
                                        <div className="me-4 mb-2"><strong>Asistentes Máx.:</strong> {user.maxAttendees}</div>
                                        <div className="me-4 mb-2"><strong>Inicio:</strong> {user.startTime?.toLocaleString()}</div>
                                        <div className="me-4 mb-2"><strong>Duración:</strong> {user.duration} min</div>
                                        <div className="me-4 mb-2"><strong>Fin:</strong> {user.endTime?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center ms-3">
                                        {userRole === 'gerente' && user.invalid && (
                                            <Button
                                            variant="outline-light"
                                            className="d-flex align-items-center justify-content-center me-2"
                                            onClick={() => handleApproveClick(user)} 
                                            style={{
                                                backgroundColor: 'white',
                                                borderRadius: '6px',
                                                padding: '8px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            }}
                                            >
                                            <FiCheck style={{ color: 'green', fontSize: '20px' }} />
                                            </Button>
                                        )}
                                        
                                        <Button
                                            variant="outline-light"
                                            className="d-flex align-items-center justify-content-center"
                                            onClick={() => handleCancelClick(user)}
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
                <div className="pt-4 pb-2">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                        {userRole === 'gerente' && (
                            <div className="d-flex justify-content-center justify-content-md-start gap-2" style={{ width: "370px" }}>
                                <Button
                                    onClick={showOnlyActiveReservations}
                                    style={{
                                        borderRadius: "30px",
                                        backgroundColor: showActiveReservations ? "#0056b3" : "#000842",
                                        borderColor: showActiveReservations ? "#0056b3" : "#000842",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        transition: "all 0.3s ease",
                                        letterSpacing: "0.5px",
                                        fontSize: "1rem",
                                    }}
                                >
                                    Ver reservas activas
                                </Button>
                            </div>
                        )}

                        <div className="d-flex justify-content-center">
                            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                        </div>

                        {userRole === 'gerente' && (
                            <div className="d-flex justify-content-center justify-content-md-end gap-2" style={{ width: "370px" }}>
                                <Button
                                    onClick={toggleMyReservations}
                                    style={{
                                        borderRadius: "30px",
                                        backgroundColor: "#000842",
                                        borderColor: "#000842",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                        transition: "all 0.3s ease",
                                        letterSpacing: "0.5px",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {showMyReservations ? "Ver todas las reservas" : "Ver mis reservas"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
            <CustomModal
                show={showCancelModal}
                onHide={handleCloseCancelModal}
                title={selectedReservation ? `Cancelar reserva del ${selectedReservation.category} ${selectedReservation.spaceId}` : "Cancelar reserva"}
                bodyText={selectedReservation ? `¿Estás seguro que deseas cancelar la reserva del ${selectedReservation.category} ${selectedReservation.spaceId} con fecha de inicio: ${selectedReservation.startTime?.toLocaleString()}?`
                    : "¿Estás seguro que deseas cancelar la reserva?"}
                confirmButtonText="Cancelar reserva"
                onSave={handleCloseCancelModal}
            />
            <CustomModal
                show={showApproveModal}
                onHide={handleCloseApproveModal}
                title={selectedReservation ? `Volver a la normalidad la reserva del ${selectedReservation.category} ${selectedReservation.spaceId}` : "Volver a la normalidad la reserva"}
                bodyText={selectedReservation ? `¿Quieres volver a la normalidad la reserva del ${selectedReservation.category} ${selectedReservation.spaceId} con fecha de inicio: ${selectedReservation.startTime?.toLocaleString()}?`
                    : "¿Quieres volver a la normalidad esta reserva?"}
                confirmButtonText="Normalizar reserva"
                onSave={handleCloseApproveModal}
            />
        </div>
    );
};

export default Reservations;