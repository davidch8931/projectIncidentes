import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: -0.9374805,
  lng: -78.6161327,
};

function MapaSelector({ onSelect }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAgQcQVrKcaj9Rl6IqgmcYAyuZldwN9soE", 
  });

  const [position, setPosition] = useState(defaultCenter);

  const handleDragEnd = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });
    onSelect({ lat, lng });
  }, [onSelect]);

  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={15}>
      <Marker
        position={position}
        draggable={true}
        onDragEnd={handleDragEnd}
        title="Seleccione la ubicación"
      />
    </GoogleMap>
  );
}

export default React.memo(MapaSelector);
