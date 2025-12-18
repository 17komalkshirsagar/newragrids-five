import React, { useRef, useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationModal = ({ open, onClose, onSave, initialLocation }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [mapKey, setMapKey] = useState(0);
  const [location, setLocation] = useState(null);

  // ------------------------------
  // 🔥 satellite + labels (HYBRID)
  // ------------------------------

  const streetLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );

  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  );

  const hybridLabels = L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
  );

  const hybridGroup = L.layerGroup([satelliteLayer, hybridLabels]);

  // ------------------------------
  // Remount map on each open
  // ------------------------------
  useEffect(() => {
    if (open) setMapKey((p) => p + 1);
  }, [open]);

  // ------------------------------
  // Initialize map
  // ------------------------------
  useEffect(() => {
    if (!open) return;

    mapInstance.current = L.map(mapRef.current).setView([20.6, 78.9], 5);

    // default layer
    streetLayer.addTo(mapInstance.current);

    // Add layer control
    L.control
      .layers(
        {
          "🌍 Street": streetLayer,
          "🛰 Satellite": satelliteLayer,
          "🛰 Hybrid (Satellite + Labels)": hybridGroup,
        },
        {},
        { position: "topright" }
      )
      .addTo(mapInstance.current);

    // restore previous location
    if (initialLocation.lat && initialLocation.lng) {
      const lat = Number(initialLocation.lat);
      const lng = Number(initialLocation.lng);

      setLocation({ lat, lng });

      markerRef.current = L.marker([lat, lng]).addTo(mapInstance.current);
      mapInstance.current.setView([lat, lng], 16);
    }

    // map click event
    mapInstance.current.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });

      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lng]).addTo(mapInstance.current);
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      mapInstance.current.setView([lat, lng], 16);
    });

  }, [mapKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl p-4 max-w-xl w-full">
        <h2 className="text-xl font-bold mb-3">📍 Select Location</h2>

        {/* ⭐ KEY FIX prevents white map on reopen */}
        <div
          key={mapKey}
          ref={mapRef}
          className="w-full h-[350px] border rounded-lg"
        ></div>

        {location && (
          <div className="mt-3 bg-blue-100 p-2 rounded">
            <p><b>Latitude:</b> {location.lat.toFixed(6)}</p>
            <p><b>Longitude:</b> {location.lng.toFixed(6)}</p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button className="w-full bg-gray-300 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            disabled={!location}
            onClick={() => {
              onSave(location);
              onClose();
            }}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
