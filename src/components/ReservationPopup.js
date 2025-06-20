import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../authContext';
import axios from 'axios';
import '../css/CustomPopup.css';

const API_URL = 'https://back-end-sv3z.onrender.com';

const CustomPopup = ({ show, onHide, initialData, multipleSpacesData, onUpdate }) => {

    const { userRole, isAuthenticated, authToken, isTokenExpired, userId } = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [isReserving, setIsReserving] = useState(false);
    const [reservationError, setReservationError] = useState("");
    const [spaceData, setSpaceData] = useState(initialData);
    const [originalData, setOriginalData] = useState({});
    const [updateError, setUpdateError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [reservationData, setReservationData] = useState({tipoUso: "docencia",maxAsistentes: 1,fechaInicio: "",duracion: 60, detalles: "" });
    const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
    const [reservationSuccess, setReservationSuccess] = useState(false);

    // Se determina si estamos en modo múltiples espacios
    const isMultipleSpaces = multipleSpacesData && multipleSpacesData.length > 0;
    const currentSpaces = isMultipleSpaces ? multipleSpacesData : (initialData ? [initialData] : []);
    
    useEffect(() => {
        if (initialData && !isMultipleSpaces) {
            const formattedData = {
                ...initialData,
                reservationCategory: initialData.reservationCategory === null
                    ? ""
                    : typeof initialData.reservationCategory === 'object'
                        ? initialData.reservationCategory.name
                        : initialData.reservationCategory
            };
            
            setSpaceData(formattedData);
            setOriginalData(formattedData);
        }
    }, [initialData, isMultipleSpaces]);

    const buttonStyle = {
        backgroundColor: '#000842',
        color: 'white',
        borderRadius: '10px',
        padding: '7px 16px',
        minWidth: '140px'
    };

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "isReservable") {
            setSpaceData({ ...spaceData, [name]: checked });
        } else if (name === "maxUsagePercentage") {
            setSpaceData({ ...spaceData, [name]: parseInt(value) });
        } else if (name === "assignmentTarget") {
            setSpaceData({
                ...spaceData,
                assignmentTarget: { ...spaceData.assignmentTarget, type: value }
            });
        } else {
            setSpaceData({ ...spaceData, [name]: value });
        }
    };

    const isEqual = (obj1, obj2) => {
        if (typeof obj1 !== typeof obj2) return false;
        
        if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
            return obj1 === obj2;
        }
        
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) return false;
            return obj1.every((val, idx) => isEqual(val, obj2[idx]));
        }
        
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        
        if (keys1.length !== keys2.length) return false;
        
        return keys1.every(key => {
            if (!obj2.hasOwnProperty(key)) return false;
            return isEqual(obj1[key], obj2[key]);
        });
    };

    const prepareUpdateData = () => {
        const updateData = {};
       
        updateData.reservationCategory = spaceData.reservationCategory;
    
        updateData.assignmentTarget = {
            type: spaceData.assignmentTarget.type,
            targets: spaceData.assignmentTarget.targets
        };

        if (spaceData.maxUsagePercentage !== originalData.maxUsagePercentage && spaceData.maxUsagePercentage != null && !isNaN(spaceData.maxUsagePercentage)) {
            updateData.maxUsagePercentage = spaceData.maxUsagePercentage;
        }
        
        if (!isEqual(spaceData.customSchedule, originalData.customSchedule)) {
            updateData.customSchedule = spaceData.customSchedule;
        }
        
        updateData.isReservable = spaceData.isReservable;
        
        return updateData;
    };

    const handleModify = async () => {
        setUpdateError("");
        setIsLoading(true);
        setValidationErrors({});

        const errors = {};
        if (spaceData.isReservable && !spaceData.reservationCategory) {
            errors.reservationCategory = "Debe seleccionar una categoría de reserva si el espacio es reservable";
        }
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setIsLoading(false);
            return;
        }
            
        try {
            if (!isAuthenticated || !authToken) {
                throw new Error("No hay sesión activa. Por favor, inicie sesión nuevamente.");
            }
            
            if (isTokenExpired()) {
                throw new Error("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
            }
            
            const updateData = prepareUpdateData();

            const response = await axios.put(
                `${API_URL}/api/spaces/${spaceData.id}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );
            
            console.log("Espacio actualizado exitosamente:", response.data);

            response.data = {
                ...response.data,
                maxUsagePercentage: response.data.maxUsagePercentage ?? originalData.maxUsagePercentage,
                customSchedule: response.data.customSchedule ?? originalData.customSchedule,
                creId: spaceData.creId
            };
            
            if (onUpdate) {
                onUpdate(response.data);
            }
            
            setEditMode(false);
            
        } catch (error) {
            console.error("Error al actualizar el espacio:", error);
            
            // Se muestran los mensajes de error específicos
            if (error.response) {
                // Error de respuesta del servidor
                if (error.response.status === 401) {
                    setUpdateError("Sesión no válida o expirada. Por favor, inicie sesión nuevamente.");
                } else if (error.response.status === 403) {
                    setUpdateError("No tiene permisos suficientes para realizar esta acción.");
                } else if (error.response.data) {

                    const serverErrorMessage = error.response.data.message || error.response.data.error;
                    
                    if (serverErrorMessage) {
                        setUpdateError(`${serverErrorMessage}`);
                    } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                        const errorsList = error.response.data.errors.map(err => err.msg || err.message).join(", ");
                        setUpdateError(`Errores de validación: ${errorsList}`);
                    } else {
                        setUpdateError(`Error (${error.response.status}): No se pudo actualizar el espacio`);
                    }
                } else {
                    setUpdateError(`Error ${error.response.status}: No se pudo actualizar el espacio`);
                }
            } else if (error.request) {
                setUpdateError("No se pudo conectar con el servidor. Verifique su conexión a internet.");
            } else {
                setUpdateError(`Error inesperado: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const prepareReservationData = () => {
        const reservation = {};
       
        reservation.userId = userId;
        if(isMultipleSpaces){
            reservation.spaceIds = multipleSpacesData.map(space => space.id);
        }else{
            reservation.spaceIds = [initialData.id];
        }
        reservation.usageType = reservationData.tipoUso;
        reservation.maxAttendees = reservationData.maxAsistentes;
        reservation.startTime = reservationData.fechaInicio;
        reservation.duration = reservationData.duracion;
        reservation.additionalDetails = reservationData.detalles;
        
        return reservation;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservationData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleReservationSubmit = async() => {
        setIsSubmittingReservation(true);
        setReservationError("");
        setReservationSuccess(false);
        const ReservData = prepareReservationData();
        try {
            const response = await axios.post(
                `${API_URL}/api/reservations`,ReservData,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );
            console.log("Reserva creada exitosamente:", response.data);
            setReservationSuccess(true);
            // Caso en el que no hay error
            setTimeout(() => {
                setIsReserving(false);
                setReservationSuccess(false);
                onHide();
            }, 1000);
        } catch (error) {
            const mensajeBackend = error.response?.data?.error;
            if (mensajeBackend) {
                setReservationError(`${mensajeBackend}`);
            } else {
                setReservationError(`Error al crear la reserva: ${error.message}`);
            }
        } finally {
        setIsSubmittingReservation(false);
    }
    };

    const resetPopupState = () => {
        setEditMode(false);
        setIsReserving(false);
        setReservationError("");
        setUpdateError("");
    };



    // Función para renderizar la información de un espacio individual
    const renderSpaceDetails = (space, index = null) => (
        <div key={space.id} className={index !== null && index > 0 ? 'mt-4 pt-4 border-top' : ''}>
            {isMultipleSpaces && (
                <h6 className="mb-3 text-center text-primary">
                    Espacio {index + 1}: {space.name}
                </h6>
            )}
            <div className="row">
                <div className="col-md-6">
                    <table className="table table-sm table-striped table-bordered shadow-sm rounded">
                        <tbody>
                            <tr><th scope="row">Planta</th><td>{space.floor}ª</td></tr>
                            <tr><th scope="row">Capacidad</th><td>{space.capacity} personas</td></tr>
                            <tr>
                                <th scope="row">Tipo de espacio</th>
                                <td>{typeof space.spaceType === 'object' 
                                        ? space.spaceType?.name 
                                        : space.spaceType}</td>
                            </tr>
                            <tr>
                                <th scope="row">Categoría de reserva</th>
                                <td>
                                    {
                                    typeof space.reservationCategory === 'object' && space.reservationCategory !== null
                                        ? space.reservationCategory.name
                                        : space.reservationCategory || "Sin categoría"
                                    }
                                </td>
                            </tr>
                            <tr><th scope="row">Reservable</th><td>{space.isReservable ? "Sí" : "No"}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <table className="table table-sm table-striped table-bordered shadow-sm rounded">
                        <tbody>
                            <tr><th scope="row">Identificador CRE</th><td>{space.creId}</td></tr>
                            <tr>
                                <th scope="row">Asignado a</th>
                                <td>
                                    {{
                                    eina: "EINA",
                                    department: "Departamento",
                                    person: "Persona"
                                    }[space.assignmentTarget.type] || space.assignmentTarget.type}
                                </td>
                            </tr>
                            <tr><th scope="row">Uso máximo permitido</th><td>{space.maxUsagePercentage}%</td></tr>
                            <tr>
                                <th scope="row">Horario de reservas</th>
                                <td>
                                    <div>
                                        <strong>Laborables:</strong>{" "}
                                        {space.customSchedule?.weekdays.open && space.customSchedule?.weekdays.close
                                            ? `${space.customSchedule.weekdays.open} - ${space.customSchedule.weekdays.close}`
                                            : "Cerrado"}
                                    </div>
                                    <div>
                                        <strong>Sábados:</strong>{" "}
                                        {space.customSchedule?.saturday.open && space.customSchedule?.saturday.close
                                            ? `${space.customSchedule.saturday.open} - ${space.customSchedule.saturday.close}`
                                            : "Cerrado"}
                                    </div>
                                    <div>
                                        <strong>Domingos:</strong>{" "}
                                        {space.customSchedule?.sunday.open && space.customSchedule?.sunday.close
                                            ? `${space.customSchedule.sunday.open} - ${space.customSchedule.sunday.close}`
                                            : "Cerrado"}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            show={show}
            onHide={() => {
                onHide();
                resetPopupState();
            }}
            centered
            dialogClassName="custom-modal"
            backdrop="static"
            size={isMultipleSpaces ? "xl" : "lg"}
        >
            {/* Título variable del pop up */}
            <Modal.Header className="position-relative">
                <div className="position-absolute end-0 top-0 p-3">
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => {
                            onHide();
                            resetPopupState();
                        }}
                        aria-label="Close"
                    ></button>
                </div>
                <Modal.Title className="w-100 text-center">
                {editMode
                    ? `Modificar información variable del ${spaceData.name}`
                    : isReserving
                    ? isMultipleSpaces 
                        ? `Reservar ${currentSpaces.length} espacios`
                        : `Reservar ${spaceData?.name || ''}`
                    : isMultipleSpaces
                    ? `Información de ${currentSpaces.length} espacios`
                    : spaceData?.name || ''}
                </Modal.Title>
            </Modal.Header>

            {/* Contenido variable del pop up */}
            <Modal.Body className="custom-modal-body" style={isMultipleSpaces ? { maxHeight: '60vh', overflowY: 'auto' } : {}}>
                {/* Mostrar alerta de error si existe */}
                {updateError && (
                    <Alert variant="danger" className="mb-3">
                        {updateError}
                    </Alert>
                )}                
                {editMode ? (
                    // ===================================================================================
                    // MODO PARA CAMBIAR INFORMACIÓN DE LOS ESPACIOS
                    // Contenido si se esta editando los datos del espacio (solo para espacio individual)
                    // ===================================================================================
                    <Form>
                        {/* Campo para la categoría de reserva */}
                        <Form.Group className="mb-2">
                            <Form.Label>Categoría de reserva {spaceData.isReservable && <span className="text-danger">*</span>}</Form.Label>
                            <Form.Select
                                name="reservationCategory"
                                value={spaceData.reservationCategory || ""}
                                onChange={handleInputChange}
                                isInvalid={validationErrors.reservationCategory}
                            >
                                {(
                                    typeof spaceData.spaceType === 'string'
                                        ? spaceData.spaceType === 'otro'
                                        : spaceData.spaceType?.name === 'otro'
                                ) && (
                                    <option value="">SIN CATEGORÍA DE RESERVA</option>
                                )}
                                <option value="aula">Aula</option>
                                <option value="seminario">Seminario</option>
                                <option value="laboratorio">Laboratorio</option>
                                <option value="sala común">Sala común</option>
                                <option value="despacho">Despacho</option>
                            </Form.Select>
                            {validationErrors.reservationCategory && (
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.reservationCategory}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        {/* Campo para la asignación */}
                        <Form.Group className="mb-2">
                            <Form.Label>Asignado a</Form.Label>
                                <Form.Select
                                    name="assignmentTargetType"
                                    value={spaceData.assignmentTarget.type}
                                    onChange={(e) => {
                                        const newType = e.target.value;
                                        let newTargets = [];
                                        if (newType === "department") {
                                            newTargets = ["informática e ingeniería de sistemas"];
                                        } else if (newType === "person") {
                                            newTargets = [""];
                                        }
                                        setSpaceData({
                                            ...spaceData,
                                            assignmentTarget: { type: newType, targets: newTargets }
                                        });
                                    }}
                                >
                                    <option value="eina">EINA</option>
                                    <option value="department">Departamento</option>
                                    <option value="person">Persona</option>
                                </Form.Select>
                        </Form.Group>

                        {/* Si la asignación es un departamento especificar */}
                        {spaceData.assignmentTarget.type === "department" && (
                            <Form.Group className="mb-2">
                                <Form.Label>Departamento asignado</Form.Label>
                                    <Form.Select
                                        onChange={(e) =>
                                            setSpaceData({
                                                ...spaceData,
                                                assignmentTarget: {
                                                    ...spaceData.assignmentTarget,
                                                    targets: [e.target.value]
                                                }
                                            })
                                        }
                                        value={spaceData.assignmentTarget.targets?.[0] || ""}
                                    >
                                        <option value="informática e ingeniería de sistemas">
                                            Informática e Ingeniería de Sistemas
                                        </option>
                                        <option value="ingeniería electrónica y comunicaciones">
                                            Ingeniería Electrónica y Comunicaciones
                                        </option>
                                    </Form.Select>
                            </Form.Group>
                        )}

                        {/* Si la asignación es un persona especificar */}
                        {spaceData.assignmentTarget.type === "person" && (
                            <Form.Group className="mb-2">
                                <Form.Label>ID de la persona asignada</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        value={(spaceData.assignmentTarget.targets || []).join(", ")}
                                        onChange={(e) =>
                                            setSpaceData({
                                                ...spaceData,
                                                assignmentTarget: {
                                                    ...spaceData.assignmentTarget,
                                                    targets: e.target.value.split(",").map(t => t.trim())
                                                }
                                            })
                                        }
                                    />
                            </Form.Group>
                        )}

                        {/* Campo para el porcentaje máximo de uso */}
                        <Form.Group className="mb-2">
                            <Form.Label>Porcentaje máximo de uso</Form.Label>
                            <Form.Control
                                type="number"
                                name="maxUsagePercentage"
                                value={spaceData.maxUsagePercentage ?? ""}
                                onChange={handleInputChange}
                                min={0}
                                max={100}
                            />
                        </Form.Group>

                        {/* Campo para los horarios de reserva */}
                        <Form.Group>
                            <Form.Label>Horario de reservas</Form.Label>
                            <div className="table-responsive">
                                <table className="table table-bordered text-center align-middle" style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Laborables</th>
                                            <th>Sábados</th>
                                            <th>Domingos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {['weekdays', 'saturday', 'sunday'].map((dayKey) => (
                                                <td key={dayKey}>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Form.Control
                                                            type="time"
                                                            value={spaceData.customSchedule[dayKey].open || ""}
                                                            onChange={(e) =>
                                                                setSpaceData({
                                                                    ...spaceData,
                                                                    customSchedule: {
                                                                        ...spaceData.customSchedule,
                                                                        [dayKey]: {
                                                                            ...spaceData.customSchedule[dayKey],
                                                                            open: e.target.value,
                                                                        },
                                                                    },
                                                                })
                                                            }
                                                            style={{ minWidth: 0 }}
                                                        />
                                                        <Form.Control
                                                            type="time"
                                                            value={spaceData.customSchedule[dayKey].close || ""}
                                                            onChange={(e) =>
                                                                setSpaceData({
                                                                    ...spaceData,
                                                                    customSchedule: {
                                                                        ...spaceData.customSchedule,
                                                                        [dayKey]: {
                                                                            ...spaceData.customSchedule[dayKey],
                                                                            close: e.target.value,
                                                                        },
                                                                    },
                                                                })
                                                            }
                                                            style={{ minWidth: 0 }}
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Form.Group>

                        {/* Campo para indicar si es reservable */}
                        <Form.Group className="mb-2">
                            <Form.Label>Reservable</Form.Label>
                            <Form.Check 
                                type="checkbox" 
                                label="Marca si quieres que sea reservable"
                                name="isReservable"
                                checked={spaceData.isReservable}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                ): isReserving ? (
                    // ===================================================================================
                    // MODO SE ESTÁ REALIZANDO UNA RESERVA
                    // Contenido si se esta realizando la reserva
                    // ===================================================================================
                    <Form>
                      {/* Campo para indicar el tipo de uso*/}
                        <Form.Group className="mb-2">
                            <Form.Label>Tipo de uso</Form.Label>
                            <Form.Select
                            name="tipoUso"
                            value={reservationData.tipoUso}
                            onChange={handleChange}
                            >
                            <option value="docencia">Docencia</option>
                            <option value="investigacion">Investigación</option>
                            <option value="gestion">Gestión</option>
                            <option value="otro">Otro</option>
                            </Form.Select>
                        </Form.Group>
                  
                      {/* Campo para indicar el número máximo de asistentes */}
                        <Form.Group className="mb-2">
                            <Form.Label>Número máximo de asistentes</Form.Label>
                            <Form.Control
                            type="number"
                            name="maxAsistentes"
                            min="1"
                            value={reservationData.maxAsistentes}
                            onChange={handleChange}
                            />
                        </Form.Group>
                  
                      {/* Campo para indicar la fecha de inicio */}
                       <Form.Group className="mb-2">
                            <Form.Label>Fecha y hora de inicio</Form.Label>
                            <Form.Control
                            type="datetime-local"
                            name="fechaInicio"
                            value={reservationData.fechaInicio}
                            onChange={handleChange}
                            />
                        </Form.Group>
                  
                      {/* Campo para indicar la duración de la reserva */}
                        <Form.Group className="mb-2">
                            <Form.Label>Duración (en minutos)</Form.Label>
                            <Form.Control
                            type="number"
                            name="duracion"
                            min="1"
                            value={reservationData.duracion}
                            onChange={handleChange}
                            />
                        </Form.Group>
                      {/* Campo para indicar detalles adicionales */}
                        <Form.Group className="mb-2">
                            <Form.Label>Detalles adicionales</Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={2}
                            name="detalles"
                            value={reservationData.detalles}
                            onChange={handleChange}
                            />
                        </Form.Group>

                      {/* Mensaje en caso de error */}
                      {reservationError && (
                        <div className="text-danger fw-bold mb-2">
                          ⚠ {reservationError}
                        </div>
                      )}
                    </Form>
                  ) : (
                    // ===================================================================================
                    // MODO PRINCIPAL EN EL QUE SE MUESTRA LA INFORMACIÓN
                    // En el caso de que no se este editando se muestra la info del espacio(s)
                    // ===================================================================================
                    <div>
                        <h5 className="mb-4 text-center">
                            {isMultipleSpaces ? 'Detalles de los espacios' : 'Detalles del espacio'}
                        </h5>
                        {currentSpaces.map((space, index) => renderSpaceDetails(space, isMultipleSpaces ? index : null))}
                    </div>
                )}
            </Modal.Body>

            {/* Botones variable del pop up */}
            <Modal.Footer className="d-flex justify-content-center gap-5">
                {!editMode && !isReserving && (
                    <>
                        <Button
                            variant="outline-light"
                            onClick={() => {
                                setIsReserving(true);
                                setEditMode(false);
                            }}
                            style={buttonStyle}
                            disabled={!isAuthenticated || isTokenExpired()}
                        >
                            Reservar
                        </Button>
    
                        {/* Solo mostrar botón de modificar para espacios individuales */}
                        {userRole === "gerente" && !isMultipleSpaces && (
                            <Button
                                variant="outline-light"
                                onClick={() => setEditMode(true)}
                                style={buttonStyle}
                                disabled={!isAuthenticated || isTokenExpired()}
                            >
                                Cambiar info
                            </Button>
                        )}
                    </>
                )}

                {editMode && userRole === "gerente" && !isMultipleSpaces && (
                    <Button
                        variant="outline-light"
                        onClick={handleModify}
                        style={buttonStyle}
                        disabled={isLoading || !isAuthenticated || isTokenExpired()}
                    >
                        {isLoading ? 'Enviando...' : 'Modificar info'}
                    </Button>
                )}

                {isReserving && (
                    <Button
                        variant="outline-light"
                        onClick={handleReservationSubmit}
                        style={buttonStyle}
                        disabled={isLoading || !isAuthenticated || isTokenExpired()}
                    >
                        Finalizar reserva
                    </Button>
                )}
                {isSubmittingReservation && (
                        <div className="text-center my-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Creando reserva...</span>
                            </div>
                            <p className="mt-2"><strong>Creando reserva...</strong></p>
                        </div>
                )}
                {reservationSuccess && (
                        <Alert variant="success" className="text-center">
                            Reserva creada correctamente.
                        </Alert>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default CustomPopup;
