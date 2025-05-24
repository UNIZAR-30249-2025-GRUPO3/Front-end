import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FiCalendar, FiTrash2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import CustomModal from '../components/CustomModal';
import Pagination from "../components/CustomPagination";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';



const API_URL = 'https://back-end-sv3z.onrender.com';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { userRole, userId } = useAuth();
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMyReservations, setShowMyReservations] = useState(true);
    const [showActiveReservations, setShowActiveReservations] = useState(false);
    const [data, setData] = useState([]);


    const reservationsPerPage = 10;
    const now = new Date();

    data.forEach(reservation => {
        reservation.endTime = new Date(reservation.startTime.getTime() + reservation.duration * 60000);
    });


    const activeReservations = data.filter(reservation => reservation.endTime > now);
    const myReservations = data.filter(reservation => reservation.userId === userId);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users`);
            const users = response.data.map(user => ({
                id: user.id,
                name: user.name
            }));
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            return []; 
        }
    };

   const fetchSpacesbyID = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/api/spaces/${id}`);
            const space = response.data;
            return {
                idSpace: space.idSpace,
                id: space.id,
                name: space.name,
                category: space.reservationCategory?.name || 'Sin categoría',
            };
        } catch (error) {
            console.error('Error fetching space with ID ${id}:', error);
            return null;
        }
    };

    const getUserNameById = (users, userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : `Usuario ${userId}`;
    };

    const getSpaceNameById = async (spaces, spaceId) => {
        const space = spaces.find(s => s.id === spaceId);
        return space ? space.name : `${spaceId}`;
    };

    const getSpaceCategoryById = async (spaces, spaceId) => {
        const space = spaces.find(s => s.id === spaceId);
        return space ? space.category : `Sin categoria`;
    };

    const fetchSpacesforReservations = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/reservations`, {
                timeout: 5000
            });
            const apiData = response.data;
            const allSpaceIds = apiData.flatMap(res => res.spaceIds);
            const uniqueSpaceIds = [...new Set(allSpaceIds)];

            return uniqueSpaceIds;
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const deleteReservation = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/reservations/${id}`, { 
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting reservation:', error);
            throw error; 
        }
    };


    const fetchAllReservations = async (users, spaces) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/api/reservations`, {
                timeout: 10000 
            });
            const apiData = response.data;

            const transformedData = await Promise.all(
                apiData.map(async (res) => {
                    const startTime = new Date(res.startTime);
                    const endTime = new Date(startTime.getTime() + res.duration * 60000);
                    return {
                        id: res.id,
                        spaceId: res.spaceIds ? (await Promise.all(res.spaceIds.map(id => getSpaceNameById(spaces, id)))).join(', ') : '',
                        userName: getUserNameById(users, res.userId),
                        userId: res.userId,
                        category: await getSpaceCategoryById(spaces, res.spaceIds[0]),
                        usageType: res.usageType,
                        maxAttendees: res.maxAttendees,
                        startTime,
                        endTime,
                        duration: res.duration,
                        invalid: res.status === "potentially_invalid",
                    };
                })
            );

            setReservations(transformedData);
            setData(transformedData);
        } catch (err) {
            console.error("Error fetching reservations:", err);
            setError("No se pudieron cargar las reservas.");
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    const loaded = useRef(false);

    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const users = await fetchUsers();
                console.log("Usuarios:", users);
                const spaceids = await fetchSpacesforReservations();
                console.log("Ids:", spaceids);
                const spaces = [];
                for (let i = 0; i < spaceids.length; i++) {
                    const space = await fetchSpacesbyID(spaceids[i]);
                    if (space) {
                        spaces.push(space);
                    }
                }
                console.log("Espacios:", spaces);
                if (users.length > 0 && spaces.length > 0) {
                    fetchAllReservations(users, spaces);
                }
            } catch (err) {
                console.error("Error cargando datos iniciales:", err);
                setError("No se pudieron cargar los datos iniciales.");
            } finally {
                setLoading(false); 
        }
    };
        loadInitialData();
    }, []);


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

    const handleConfirmCancel = async () => {
        if (selectedReservation) {
            try {
                console.log("Id:", selectedReservation.id);
                await deleteReservation(selectedReservation.id);

                setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));
                setData(prev => prev.filter(r => r.id !== selectedReservation.id));
                
            } catch (error) {
                console.error('Error:', error);
            } finally {
                handleCloseCancelModal();
            }
        }
        else{
            console.log("Reserva no seleccionada");
        }
    };



    const displayedData = data.filter(reservation => {
        if (showMyReservations) {
            if (Number(reservation.userId) !== Number(userId)){
                return false;
            } 
        }
        
        if (showActiveReservations) {
            const endTime = new Date(reservation.startTime.getTime() + reservation.duration * 60000);
            if (endTime <= now) return false;
        }

        return true;
    });


    const totalPages = Math.ceil(displayedData.length / reservationsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const indexOfLastReservatio = currentPage * reservationsPerPage;
    const indexOfFirstReservatio = indexOfLastReservatio - reservationsPerPage;
    const currentReservatios = displayedData.slice(indexOfFirstReservatio, indexOfLastReservatio);
    if (loading) {
        return (
            <>
                <CustomNavbar />
                <Container className="mt-5">
                    <h4>Cargando...</h4>
                </Container>
            </>
        );
    }

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
                                            Categoría de Reserva: {user.category} | Espacios: {user.spaceId}
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
                                        <div className="me-4 mb-2"><strong>Inicio:</strong> {user.startTime?.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                                        <div className="me-4 mb-2"><strong>Duración:</strong> {user.duration} min</div>
                                        <div className="me-4 mb-2"><strong>Fin:</strong>{user.endTime?.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
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
                    {userRole === 'gerente' ? (
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
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

                        <div className="d-flex justify-content-center">
                            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                        </div>

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
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                        </div>
                    )}
                </div>
            </Container>
            <CustomModal
                show={showCancelModal}
                onHide={handleCloseCancelModal}
                title={selectedReservation ? `Cancelar reserva del ${selectedReservation.category} ${selectedReservation.spaceId}` : "Cancelar reserva"}
                bodyText={selectedReservation ? `¿Estás seguro que deseas cancelar la reserva del ${selectedReservation.category} ${selectedReservation.spaceId} con fecha de inicio: ${selectedReservation.startTime?.toLocaleString()}?`
                    : "¿Estás seguro que deseas cancelar la reserva?"}
                confirmButtonText="Cancelar reserva"
                onConfirm={handleConfirmCancel} 
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