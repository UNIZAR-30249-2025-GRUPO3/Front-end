import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/CustomPopup.css';

const CustomPopup = ({ show, onHide, initialData }) => {
    const userRole = sessionStorage.getItem("userRole");
    const [editMode, setEditMode] = useState(false);
    const [isReserving, setIsReserving] = useState(false);
    const [reservationError, setReservationError] = useState("");
    const [spaceData, setSpaceData] = useState(initialData);

    const buttonStyle = {
        backgroundColor: '#000842',
        color: 'white',
        borderRadius: '10px',
        padding: '7px 16px',
        minWidth: '140px'
    };

    // Información del espacio - DEMOMENTO HARDCODEADA
    /*const [spaceData, setSpaceData] = useState({
        name: "Espacio X",
        floor: 2,
        capacity: 30,
        spaceType: "aula",
        reservationCategory: "aula",
        isReservable: true,
        assignmentTarget: { type: "eina", targets: [] },
        maxUsagePercentage: 80,
        customSchedule: {
            weekdays: { open: "", close: "" },
            saturday: { open: "", close: "" },
            sunday: { open: "", close: "" },
        },
    });*/

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

    const handleModify = () => {
        // AQUI LÓGICA DEL BACKEND PARA MODIFICAR DATOS
        console.log("Modificando espacio con datos:", spaceData);
        setEditMode(false);
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                onHide();
                setEditMode(false);
                setIsReserving(false);
                setReservationError("");
            }}
            centered
            dialogClassName="custom-modal"
            backdrop="static"
        >
            {/* Título variable del pop up */}
            <Modal.Header className="position-relative">
                <div className="position-absolute end-0 top-0 p-3">
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => {
                            onHide();
                            setEditMode(false);
                            setIsReserving(false);
                            setReservationError("");
                        }}
                        aria-label="Close"
                    ></button>
                </div>
                <Modal.Title className="w-100 text-center">
                {editMode
                    ? `Modificar información variable del ${spaceData.name}`
                    : isReserving
                    ? `Reservar ${spaceData.name}`
                    : spaceData.name}
                </Modal.Title>
            </Modal.Header>

            {/* Contenido variable del pop up */}
            <Modal.Body className="custom-modal-body">
                {editMode ? (
                    // Contenido si se esta editando los datos del espacio
                    <Form>
                        {/* Campo para la categoría de reserva */}
                        <Form.Group className="mb-2">
                            <Form.Label>Categoría de reserva</Form.Label>
                            <Form.Select
                                name="reservationCategory"
                                value={spaceData.reservationCategory}
                                onChange={handleInputChange}
                            >
                                <option value="aula">Aula</option>
                                <option value="seminario">Seminario</option>
                                <option value="laboratorio">Laboratorio</option>
                                <option value="sala común">Sala común</option>
                                <option value="despacho">Despacho</option>
                            </Form.Select>
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
                                        if (newType === "departamento") {
                                            newTargets = ["informática e ingeniería de sistemas"];
                                        } else if (newType === "persona") {
                                            newTargets = [""];
                                        }
                                        setSpaceData({
                                            ...spaceData,
                                            assignmentTarget: { type: newType, targets: newTargets }
                                        });
                                    }}
                                >
                                    <option value="eina">EINA</option>
                                    <option value="departamento">Departamento</option>
                                    <option value="persona">Persona</option>
                                </Form.Select>
                        </Form.Group>

                        {/* Si la asignación es un departamento especificar */}
                        {spaceData.assignmentTarget.type === "departamento" && (
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
                                        value={spaceData.assignmentTarget.targets[0]}
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
                        {spaceData.assignmentTarget.type === "persona" && (
                            <Form.Group className="mb-2">
                                <Form.Label>ID de la persona asignada</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=""
                                        value={spaceData.assignmentTarget.targets.join(", ")}
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
                                value={spaceData.maxUsagePercentage}
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
                                                            value={spaceData.customSchedule[dayKey].open}
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
                                                            value={spaceData.customSchedule[dayKey].close}
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
                    // Contenido si se esta realizando la reserva
                    <Form>
                      {/* Campo para indicar el tipo de uso*/}
                      <Form.Group className="mb-2">
                        <Form.Label>Tipo de uso</Form.Label>
                        <Form.Select>
                          <option value="docencia">Docencia</option>
                          <option value="investigacion">Investigación</option>
                          <option value="gestion">Gestión</option>
                          <option value="otro">Otro</option>
                        </Form.Select>
                      </Form.Group>
                  
                      {/* Campo para indicar el número máximo de asistentes */}
                      <Form.Group className="mb-2">
                        <Form.Label>Número máximo de asistentes</Form.Label>
                        <Form.Control type="number" min="1" />
                      </Form.Group>
                  
                      {/* Campo para indicar la fecha de inicio */}
                      <Form.Group className="mb-2">
                        <Form.Label>Fecha y hora de inicio</Form.Label>
                        <Form.Control type="datetime-local" />
                      </Form.Group>
                  
                      {/* Campo para indicar la duración de la reserva */}
                      <Form.Group className="mb-2">
                        <Form.Label>Duración (en minutos)</Form.Label>
                        <Form.Control type="number" min="1" />
                      </Form.Group>
                  
                      {/* Campo para indicar detalles adicionales */}
                      <Form.Group className="mb-2">
                        <Form.Label>Detalles adicionales</Form.Label>
                        <Form.Control as="textarea" rows={2} />
                      </Form.Group>

                      {/* Mensaje en caso de error */}
                      {reservationError && (
                        <div className="text-danger fw-bold mb-2">
                          ⚠ {reservationError}
                        </div>
                      )}
                  
                      {/* Botón para añadir nuevos espacios a la reserva */}
                      <div className="d-flex justify-content-center">
                        <Button
                          variant="outline-light"
                          style={{
                            backgroundColor: "#000842",
                            color: "white",
                            borderRadius: "10px",
                            padding: "6px 12px",
                          }}
                          onClick={() =>{}}
                        >
                          + Añadir otro espacio a la reserva
                        </Button>
                      </div>
                  
                      
                    </Form>
                  ) : (
                    // En el caso de que no se este editando se muestra la info del espacio
                    <div>
                        <h5 className="mb-4 text-center">Detalles del espacio</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <table className="table table-sm table-striped table-bordered shadow-sm rounded">
                                    <tbody>
                                        <tr><th scope="row">Planta</th><td>{spaceData.floor}ª</td></tr>
                                        <tr><th scope="row">Capacidad</th><td>{spaceData.capacity} personas</td></tr>
                                        <tr><th scope="row">Tipo de espacio</th><td>{spaceData.spaceType}</td></tr>
                                        <tr><th scope="row">Categoría de reserva</th><td>{spaceData.reservationCategory}</td></tr>
                                        <tr><th scope="row">Reservable</th><td>{spaceData.isReservable ? "Sí" : "No"}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <table className="table table-sm table-striped table-bordered shadow-sm rounded">
                                    <tbody>
                                        <tr><th scope="row">Asignado a</th><td>{spaceData.assignmentTarget.type}</td></tr>
                                        <tr><th scope="row">Uso máximo permitido</th><td>{spaceData.maxUsagePercentage}%</td></tr>
                                        <tr>
                                            <th scope="row">Horario de reservas</th>
                                            <td>
                                                <div>
                                                    <strong>Laborables:</strong>{" "}
                                                    {spaceData.customSchedule?.weekdays.open && spaceData.customSchedule?.weekdays.close
                                                        ? `${spaceData.customSchedule.weekdays.open} - ${spaceData.customSchedule.weekdays.close}`
                                                        : "Cerrado"}
                                                </div>
                                                <div>
                                                    <strong>Sábados:</strong>{" "}
                                                    {spaceData.customSchedule?.saturday.open && spaceData.customSchedule?.saturday.close
                                                        ? `${spaceData.customSchedule.saturday.open} - ${spaceData.customSchedule.saturday.close}`
                                                        : "Cerrado"}
                                                </div>
                                                <div>
                                                    <strong>Domingos:</strong>{" "}
                                                    {spaceData.customSchedule?.sunday.open && spaceData.customSchedule?.sunday.close
                                                        ? `${spaceData.customSchedule.sunday.open} - ${spaceData.customSchedule.sunday.close}`
                                                        : "Cerrado"}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                        >
                            Reservar
                        </Button>

                        {userRole === "gerente" && (
                            <Button
                                variant="outline-light"
                                onClick={() => setEditMode(true)}
                                style={buttonStyle}
                            >
                                Cambiar info
                            </Button>
                        )}
                    </>
                )}

                {editMode && userRole === "gerente" && (
                    <Button
                        variant="outline-light"
                        onClick={handleModify}
                        style={buttonStyle}
                    >
                        Modificar info
                    </Button>
                )}

                {isReserving && (
                    <Button
                        variant="outline-light"
                        onClick={() => {
                            // Harcodeado un error de validación
                            setReservationError("Debe seleccionar una fecha y hora válida.");
                            // Casp en el que no hay error (demomento comentado)
                            // setIsReserving(false);
                            // onHide();
                        }}
                        style={buttonStyle}
                    >
                        Finalizar reserva
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default CustomPopup;
