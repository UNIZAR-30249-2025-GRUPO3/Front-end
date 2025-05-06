import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import { Container, Button, Card, Row, Col, Form} from 'react-bootstrap';
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';
import { FiRefreshCw } from "react-icons/fi";
import CustomNavbar from '../components/CustomNavbar';
import ReservationPopup from '../components/ReservationPopup';

const categoriaReserva = ["aula", "seminario", "laboratorio", "despacho", "sala común"];

const Explore = () => {

    const [showPopup, setShowPopup] = useState(false);

    const MapClickHandler = () => {
        useMapEvent('click', () => {
            setShowPopup(true);
        });
        return null;
    };

    return (
        <div className="App d-flex flex-column vh-100">
            <CustomNavbar />
            <Container fluid className="flex-grow-1">
                <Row className="h-100">
                    {/* Panel lateral */}
                    <Col lg={4} className="d-flex flex-column py-4 px-4 order-0 order-lg-0">
                        <Card className="flex-grow-1 p-3"
                            style={{
                                overflowY: 'auto',
                                border: '1px solid #ddd',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <Card.Body className="d-flex flex-column align-items-center w-100 text-center">

                                {/* Titulo */}
                                <Card.Title 
                                    style={{
                                        fontWeight: 'bold', 
                                        fontSize: '2.0rem', 
                                        marginBottom: '2.5rem',
                                        marginTop: '1rem'
                                    }}>
                                    Buscar espacios
                                </Card.Title>
                                
                                {/* Opciones de filtrado */}
                                <Container className="mb-5">
                                    <div className="d-flex justify-content-center">
                                        <div style={{ width: '100%', maxWidth: '700px' }}>
                                        
                                        {/* Identificador */}
                                        <Form.Group className="mb-3" controlId="formIdentificador">
                                            <Form.Label className="text-start d-block">Identificador</Form.Label>
                                            <Form.Control 
                                            type="text" 
                                            placeholder="Introduce el identificador" 
                                            className="bg-transparent shadow-sm"
                                            />
                                        </Form.Group>

                                        {/* Categoría */}
                                        <Form.Group className="mb-3" controlId="formCategoria">
                                            <Form.Label className="text-start d-block">Categoría</Form.Label>
                                            <Form.Select 
                                                aria-label="Selector de categorías de reserva"
                                                className="bg-transparent shadow-sm"
                                            >
                                            <option style={{ fontWeight: 'bold' }}>Selecciona categoría</option>
                                            {categoriaReserva.map((categoria, index) => (
                                                <option key={index} value={categoria}>{categoria}</option>
                                            ))}
                                            </Form.Select>
                                        </Form.Group>

                                        {/* Planta */}
                                        <Form.Group className="mb-3" controlId="formPlanta">
                                            <Form.Label className="text-start d-block">Planta</Form.Label>
                                            <Form.Select 
                                                aria-label="Selector de planta"
                                                className="bg-transparent shadow-sm"
                                            >
                                                {[0, 1, 2, 3, 4].map((planta) => (
                                                    <option key={planta} value={planta}>{planta}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                        {/* Ocupantes máximos */}
                                        <Form.Group className="mb-3" controlId="formOcupantes">
                                            <Form.Label className="text-start d-block">Ocupantes máximos</Form.Label>
                                            <Form.Control 
                                            type="number" 
                                            min="1" 
                                            placeholder="Introduce nº de ocupantes"
                                            className="bg-transparent shadow-sm"
                                            />
                                        </Form.Group>

                                        </div>
                                    </div>
                                </Container>

                                {/* Botones */}
                                <div className="w-100 d-flex align-items-center justify-content-center pb-3 mt-auto">
                                    <div className="position-relative d-flex align-items-center" style={{ width: '90%', maxWidth: '700px' }}>
                                        {/*Buscar*/}
                                        <div className="w-100 d-flex justify-content-center">
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
                                            Buscar
                                            </Button>
                                        </div>
                                        
                                        {/*Reiniciar*/}
                                        <div className="position-absolute" style={{ right: '0' }}>
                                            <Button 
                                            variant="outline-light" 
                                            onClick={() => {}} 
                                            style={{ 
                                                backgroundColor: '#000842', 
                                                color: 'white', 
                                                borderRadius: '10px', 
                                                padding: '7px 10px', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                minWidth: '42px' 
                                            }}
                                            >
                                            <FiRefreshCw size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Mapa */}
                    <Col lg={8} className="p-0 order-1 order-lg-1">
                        <div className="h-100 w-100" style={{ minHeight: "500px", border: "1px solid #000842",  }}>
                            <MapContainer
                                center={[41.683560, -0.888846]} // Coordenadas del edificio Ada Byron
                                zoom={19}
                                minZoom={18}
                                maxZoom={20}
                                maxBounds={[[41.6829, -0.8896], [41.6842, -0.8881]]}
                                maxBoundsViscosity={1.0}
                                style={{ width: "100%", height: "100%" }}
                            >
                                <MapClickHandler />
                                <TileLayer 
                                    //light_all: Estilo claro con todas las etiquetas
                                    //rastertiles/voyager_nolabels: Estilo Voyager sin etiquetas
                                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                                    maxZoom={20}
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />
                                
                                {/*<TileLayer 
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    maxZoom={20}
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />*/}

                                {/*<TileLayer
                                    url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                    maxZoom={20}
                                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                    attribution='&copy; Google Maps'
                                />*/}
                            </MapContainer>
                        </div>
                    </Col>
                </Row>
            </Container>

            <ReservationPopup show={showPopup} onHide={() => setShowPopup(false)} />
        </div>
    );
};

export default Explore;
