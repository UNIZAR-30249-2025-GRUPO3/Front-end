import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import { Container, Button, Card, Row, Col, Form} from 'react-bootstrap';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { FiRefreshCw } from "react-icons/fi";
import CustomNavbar from '../components/CustomNavbar';
import ReservationPopup from '../components/ReservationPopup';


const categoriaReserva = ["aula", "seminario", "laboratorio", "despacho", "sala común"];

// Definir colores para cada tipo de espacio
const spaceTypeColors = {
    aula: "#FF5733",
    seminario: "#33A8FF",
    laboratorio: "#33FF57",
    despacho: "#B533FF",
    "sala común": "#FFDB33",
    default: "#8A9597"
};

const Explore = () => {

    const [showPopup, setShowPopup] = useState(false);
    const [features, setFeatures] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [filteredFeatures, setFilteredFeatures] = useState([]);

    const [filters, setFilters] = useState({
        identificador: "",
        categoria: "",
        planta: "0",
        ocupantes: ""
    });

    const handleSearch = () => {
        const filtered = features.filter(feature => {
        const props = feature.properties;

        return (
            (filters.identificador === "" || props.nombre.toLowerCase().includes(filters.identificador.toLowerCase())) &&
            (filters.categoria === "" || props.reservation_category === filters.categoria) &&
            (filters.planta === "0" || props.floor?.toString() === filters.planta) &&
            (filters.ocupantes === "" || (props.capacity ?? 0) >= parseInt(filters.ocupantes))
        );
        });

        setFilteredFeatures(filtered);
    };

    const handleReset = () => {
        setFilters({
            identificador: "",
            categoria: "",
            planta: "",
            ocupantes: ""
        });
        setFilteredFeatures([]);
    };
    
    useEffect(() => {
        fetch("https://cors-anywhere.herokuapp.com/https://pygeoapi.onrender.com/collections/espacios_geograficos/items?limit=300&floor=0")
            .then(res => res.json())
            .then(data => {
                console.log(data.features);
                setFeatures(data.features);
            })
            .catch(err => console.error("Error fetching geojson:", err));
    }, []);

    const handleSpaceUpdate = (updatedSpaceData) => {
        setSelectedSpace(updatedSpaceData);
        
        console.log("Space data updated:", updatedSpaceData);
    };
    
    const getSpaceColor = (feature) => {
        const spaceType = feature.properties.spaceType || "default";
                         
        return spaceTypeColors[spaceType.toLowerCase()] || spaceTypeColors.default;
    };
    
    return (
        <div className="App d-flex flex-column vh-100">
            <CustomNavbar />
            <Container fluid className="flex-grow-1">
                <Row className="h-100">
                    {/* Panel lateral */}
                    <Col lg={4} className="d-flex flex-column py-4 px-4 order-0 order-lg-0">
                        <Card className="flex-grow-1 p-2"
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
                                                value={filters.identificador}
                                                onChange={(e) => setFilters({ ...filters, identificador: e.target.value })}
                                            />
                                        </Form.Group>

                                        {/* Categoría */}
                                        <Form.Group className="mb-3" controlId="formCategoria">
                                            <Form.Label className="text-start d-block">Categoría</Form.Label>
                                            <Form.Select 
                                                aria-label="Selector de categorías de reserva"
                                                className="bg-transparent shadow-sm"
                                                value={filters.categoria}
                                                onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                                            >
                                                <option value="">Selecciona categoría</option>
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
                                                value={filters.planta}
                                                onChange={(e) => setFilters({ ...filters, planta: e.target.value })}
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
                                                value={filters.ocupantes}
                                                onChange={(e) => setFilters({ ...filters, ocupantes: e.target.value })}
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
                                            onClick={handleSearch} 
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
                                            onClick={handleReset} 
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
                                <div style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '10px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                    zIndex: 1000
                                }}>
                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                        {Object.entries(spaceTypeColors).map(([type, color]) =>
                                            type !== "default" && (
                                                <li key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                                    <div style={{
                                                        width: '12px',
                                                        height: '12px',
                                                        backgroundColor: color,
                                                        marginRight: '6px',
                                                        border: '1px solid #000'
                                                    }}></div>
                                                    <span>{type}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <TileLayer 
                                    //light_all: Estilo claro con todas las etiquetas
                                    //rastertiles/voyager_nolabels: Estilo Voyager sin etiquetas
                                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                                    maxZoom={20}
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />
                                {features.length > 0 && (
                                <GeoJSON 
                                        data={{
                                            type: "FeatureCollection",
                                            features: features
                                        }}
                                        onEachFeature={(feature, layer) => {
                                            layer.on('click', () => {
                                                setSelectedSpace({
                                                    name: feature.properties.nombre,
                                                    floor: feature.properties.floor,
                                                    capacity: feature.properties.capacity,
                                                    spaceType: feature.properties.spaceType,
                                                    reservationCategory: feature.properties.reservation_category,
                                                    isReservable: feature.properties.is_reservable,
                                                    creId: feature.id,
                                                    assignmentTarget: feature.properties.assignment_targets 
                                                        ? feature.properties.assignment_targets 
                                                        : { type: feature.properties.assignment_type || "eina", targets: [] },
                                                    maxUsagePercentage: feature.properties.max_usage_percentage ?? 100,
                                                    customSchedule: feature.properties.custom_schedule ?? {
                                                        weekdays: { open: "", close: "" },
                                                        saturday: { open: "", close: "" },
                                                        sunday: { open: "", close: "" }
                                                    }
                                                });
                                        
                                                setShowPopup(true);
                                            });
                                        
                                        }}
                                        
                                        style={(feature) => ({
                                            color: "black",
                                            weight: 2,
                                            fillColor: getSpaceColor(feature),
                                            fillOpacity: 0.6
                                        })}
                                    />
                                )}
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

            {selectedSpace && (
                <ReservationPopup 
                    show={showPopup}
                    onHide={() => setShowPopup(false)}
                    initialData={selectedSpace}
                    onUpdate={handleSpaceUpdate}
                />
            )}

        </div>
    );
};

export default Explore;
