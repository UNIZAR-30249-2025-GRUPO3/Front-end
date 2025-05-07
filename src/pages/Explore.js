import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import { Container, Button, Card, Row, Col, Form} from 'react-bootstrap';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { FiRefreshCw } from "react-icons/fi";
import CustomNavbar from '../components/CustomNavbar';
import ReservationPopup from '../components/ReservationPopup';
import axios from 'axios';

const API_URL = 'https://back-end-sv3z.onrender.com';

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingSpaceDetails, setLoadingSpaceDetails] = useState(false);

    const [filters, setFilters] = useState({
        identificador: "",
        categoria: "",
        planta: "0",
        ocupantes: ""
    });

    // Construye la URL de la API con los filtros aplicados
    const buildApiUrl = (customFilters = filters) => {
        const baseUrl = "https://cors-anywhere.herokuapp.com/https://pygeoapi.onrender.com/collections/espacios_geograficos/items";
        
        let params = new URLSearchParams();
        params.append("limit", "300");
        
        if (customFilters.planta) {
            params.append("floor", customFilters.planta);
        }
        
        if (customFilters.categoria) {
            params.append("reservation_category", customFilters.categoria);
        }
                
        return `${baseUrl}?${params.toString()}`;
    };

    const fetchSpaces = async (customFilters = filters) => {
        setIsLoading(true);
        setError(null);

        setFeatures([]);
        
        try {
            const url = buildApiUrl(customFilters);
            console.log("Fetching URL:", url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error de API: ${response.status}`);
            }
            
            const data = await response.json();
            let filteredData = data.features;
    
            // Filtro por ocupantes (capacidad mínima)
            if (customFilters.ocupantes && !isNaN(parseInt(customFilters.ocupantes))) {
                filteredData = filteredData.filter(feature =>
                    feature.properties.capacity >= parseInt(customFilters.ocupantes)
                );
            }
    
            // Filtro por identificador (nombre)
            if (customFilters.identificador) {
                filteredData = filteredData.filter(feature => 
                    feature.id === customFilters.identificador
                );
            }                      
            
            console.log("Espacios encontrados:", filteredData.length);
            setFeatures(filteredData);
        } catch (err) {
            console.error("Error al obtener datos:", err);
            setError("No se pudieron cargar los espacios.");
            setFeatures([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSpaces();
    }, []);   

    const handleSearch = () => {
        fetchSpaces();
    };

    const handleReset = () => {
        const resetFilters = {
            identificador: "",
            categoria: "",
            planta: "0",
            ocupantes: ""
        };
        setFilters(resetFilters);
        fetchSpaces(resetFilters);
    };
    
    // Función para obtener los detalles completos de un espacio por su ID
    const fetchSpaceDetails = async (spaceId) => {
        setLoadingSpaceDetails(true);
        try {
            console.log("Obteniendo detalles del espacio:", spaceId);

            const response = await axios.get(`${API_URL}/api/spaces/${spaceId}`);
            
            const spaceData = response.data;
            console.log("Datos completos del espacio recibidos:", spaceData);
            
            const processedSpaceData = {
                id: spaceId,
                name: spaceData.name || spaceId,
                floor: spaceData.floor,
                capacity: spaceData.capacity,
                spaceType: typeof spaceData.spaceType === 'object' && spaceData.spaceType !== null 
                    ? spaceData.spaceType.name 
                    : spaceData.spaceType,
                reservationCategory: typeof spaceData.reservationCategory === 'object' && spaceData.reservationCategory !== null 
                    ? spaceData.reservationCategory.name 
                    : spaceData.reservationCategory,
                isReservable: spaceData.isReservable !== undefined ? spaceData.isReservable : false,
                creId: spaceData.idSpace || spaceId,
                assignmentTarget: spaceData.assignmentTarget || { type: "eina", targets: [] },
                maxUsagePercentage: spaceData.maxUsagePercentage !== undefined ? spaceData.maxUsagePercentage : 100,
                customSchedule: spaceData.customSchedule || {
                    weekdays: { open: "", close: "" },
                    saturday: { open: "", close: "" },
                    sunday: { open: "", close: "" }
                }
            };
            
            setSelectedSpace(processedSpaceData);
            setShowPopup(true);
        } catch (err) {
            console.error("Error al obtener detalles del espacio:", err);
            // Si hay un error en la API, usamos los datos básicos del GeoJSON
            const basicData = features.find(f => f.id === spaceId);
            if (basicData) {
                console.log("Usando datos de fallback para el espacio:", spaceId);
                const fallbackData = {
                    id: basicData.id,
                    name: basicData.properties.nombre || basicData.id,
                    floor: basicData.properties.floor,
                    capacity: basicData.properties.capacity,
                    spaceType: basicData.properties.spaceType,
                    reservationCategory: basicData.properties.reservation_category,
                    isReservable: basicData.properties.is_reservable || false,
                    creId: basicData.id,
                    assignmentTarget: basicData.properties.assignment_targets 
                        ? basicData.properties.assignment_targets 
                        : { type: basicData.properties.assignment_type || "eina", targets: [] },
                    maxUsagePercentage: basicData.properties.max_usage_percentage ?? 100,
                    customSchedule: basicData.properties.custom_schedule ?? {
                        weekdays: { open: "", close: "" },
                        saturday: { open: "", close: "" },
                        sunday: { open: "", close: "" }
                    }
                };
                setSelectedSpace(fallbackData);
                setShowPopup(true);
            }
        } finally {
            setLoadingSpaceDetails(false);
        }
    };

    const handleSpaceUpdate = (updatedSpaceData) => {
        setSelectedSpace(updatedSpaceData);
        
        console.log("Space data updated:", updatedSpaceData);
    };
    
    const getSpaceColor = (feature) => {
        const spaceType = feature.properties.reservation_category || feature.properties.spaceType || "default";
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
                                        <Form.Group className="mb-2" controlId="formIdentificador">
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
                                        <Form.Group className="mb-2" controlId="formCategoria">
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
                                        <Form.Group className="mb-2" controlId="formPlanta">
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
                                        <Form.Group className="mb-2" controlId="formOcupantes">
                                            <Form.Label className="text-start d-block">Ocupantes mínimos</Form.Label>
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

                                {/* Estado de la búsqueda */}
                                {isLoading && (
                                    <div className="text-center mb-2">
                                        <span>Cargando espacios...</span>
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="text-danger text-center mb-2">
                                        {error}
                                    </div>
                                )}
                                
                                {!isLoading && !error && features.length > 0 && (
                                    <div className="text-center mb-2">
                                        <span>Se encontraron {features.length} espacios</span>
                                    </div>
                                )}

                                {!isLoading && !error && features.length === 0 && (
                                    <div className="text-center mb-2">
                                        <span>No se encontraron espacios con los filtros</span>
                                    </div>
                                )}

                                {/* Botones */}
                                <div className="w-100 d-flex align-items-center justify-content-center pb-3 mt-auto">
                                    <div className="position-relative d-flex align-items-center" style={{ width: '90%', maxWidth: '700px' }}>
                                        {/*Buscar*/}
                                        <div className="w-100 d-flex justify-content-center">
                                            <Button 
                                            variant="outline-light" 
                                            onClick={handleSearch} 
                                            disabled={isLoading}
                                            style={{ 
                                                backgroundColor: '#000842', 
                                                color: 'white', 
                                                borderRadius: '10px', 
                                                padding: '7px 16px', 
                                                width: 'auto', 
                                                minWidth: '120px' 
                                            }}
                                            >
                                            {isLoading ? 'Buscando...' : 'Buscar'}
                                            </Button>
                                        </div>
                                        
                                        {/*Reiniciar*/}
                                        <div className="position-absolute" style={{ right: '0' }}>
                                            <Button 
                                            variant="outline-light" 
                                            onClick={handleReset} 
                                            disabled={isLoading}
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
                                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                                    maxZoom={20}
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />
                                {features.length > 0 && (
                                <GeoJSON 
                                        key={features.map(f => f.id).join('_')}
                                        data={{
                                            type: "FeatureCollection",
                                            features: features
                                        }}
                                        onEachFeature={(feature, layer) => {
                                            layer.on('click', () => {
                                                fetchSpaceDetails(feature.properties.id);
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
                    isLoading={loadingSpaceDetails}
                />
            )}

        </div>
    );
};

export default Explore;
