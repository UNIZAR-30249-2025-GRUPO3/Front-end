import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import { Container, Button, Card, Row, Col, Form} from 'react-bootstrap';
import { MapContainer, TileLayer } from 'react-leaflet';
import CustomNavbar from '../components/CustomNavbar';

const categoriaReserva = ["aula", "seminario", "laboratorio", "despacho", "sala común"];

const Explore = () => {

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
                                        fontSize: '1.75rem', 
                                        marginBottom: '1.5rem',
                                        marginTop: '2rem'
                                    }}>
                                    Buscar espacios
                                </Card.Title>
                                
                                {/* Opciones de filtrado */}
                                <Container className="mb-5">
                                    <div className="d-flex justify-content-center">
                                        <div style={{ width: '80%', maxWidth: '700px' }}>
                                            <Form.Select 
                                                aria-label="Selector de categorías de reserva" 
                                                className="mb-3 shadow-sm"
                                            >
                                                <option style={{ fontWeight: 'bold' }}>Selecciona categoría</option>
                                                {categoriaReserva.map((categoria, index) => (
                                                    <option key={index} value={categoria}>{categoria}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </div>
                                </Container>

                                {/* Botones */}
                                <div className="d-flex flex-wrap justify-content-center w-100 gap-3 mt-2">
                                    <div className="d-flex flex-column align-items-center">
                                        <Button
                                            //onClick={}
                                            variant="outline-light"
                                            style={{
                                                backgroundColor: '#000842',
                                                color: 'white',
                                                borderRadius: '10px',
                                                padding: '6px 16px',
                                                marginTop: '0.5rem',
                                                width: '130px'
                                            }}
                                        > 
                                            Buscar
                                        </Button>
                                    </div>
                                    <div className="d-flex flex-column align-items-center">
                                        <Button
                                            //onClick={}
                                            variant="outline-light"
                                            style={{
                                                backgroundColor: '#000842',
                                                color: 'white',
                                                borderRadius: '10px',
                                                padding: '6px 16px',
                                                marginTop: '0.5rem',
                                                width: '130px'
                                            }}
                                        > 
                                            Reiniciar
                                        </Button>
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
        </div>
    );
};

export default Explore;
