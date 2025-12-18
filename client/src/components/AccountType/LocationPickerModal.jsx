import React, { useRef, useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Marker
const customMarkerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Satellite Key
const MAPTILER_KEY = "OK7rdeMA7xHbtZ7VGVlq";

// Reverse Geocode
const getAddressDetails = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
    );

    const data = await res.json();
    const a = data.address;

    return {
      lat,
      lng,
      address: data.display_name || "",
      taluka: a.suburb || a.town || a.village || a.city || "",
      district: a.county || a.state_district || "",
      state: a.state || "",
    };
  } catch (err) {
    console.log("Geo Error:", err);
    return { lat, lng };
  }
};

const LocationPickerModal = ({ open, onClose, onSave, initialLocation, allLocations }) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const [mapKey, setMapKey] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [search, setSearch] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState("place"); // "place" or "coordinates"

  // ⭐ SEARCH Places by name
  const searchPlaces = async () => {
    if (!search.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${search}&format=json&addressdetails=1&limit=6`
      );
      setResults(await res.json());
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // ⭐ SEARCH by Coordinates
  const searchByCoordinates = async () => {
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid coordinates");
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert("Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180");
      return;
    }
    
    setIsSearching(true);
    try {
      // Place marker directly for coordinates
      placeMarker(lat, lng);
      setResults([]); // Clear any previous place search results
    } catch (error) {
      console.error("Coordinates search error:", error);
      alert("Error searching by coordinates");
    } finally {
      setIsSearching(false);
    }
  };

  // ⭐ PLACE MARKER
  const placeMarker = async (lat, lng) => {
    if (marker.current) marker.current.remove();

    marker.current = L.marker([lat, lng], { icon: customMarkerIcon }).addTo(map.current);
    map.current.setView([lat, lng], 16);

    const details = await getAddressDetails(lat, lng);
    setSelectedLocation(details);
  };

  // ⭐ GET LIVE LOCATION (GPS)
  const getUserLocation = () => {
    setIsSearching(true);
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsSearching(false);
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          setIsSearching(false);
          reject("GPS_DISABLED");
        }
      );
    });
  };

  // ⭐ REBUILD MAP WHEN OPEN
  useEffect(() => {
    if (open) setMapKey((k) => k + 1);
  }, [open]);

  // ⭐ Store selected location
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('lastSelectedLocation', JSON.stringify(selectedLocation));
    }
  }, [selectedLocation]);

  // ⭐ Load last location
  useEffect(() => {
    if (open) {
      const savedLocation = localStorage.getItem('lastSelectedLocation');
      if (savedLocation && !initialLocation?.lat) {
        const parsedLocation = JSON.parse(savedLocation);
        setSelectedLocation(parsedLocation);
        setCoordinates({
          lat: parsedLocation.lat?.toString() || "",
          lng: parsedLocation.lng?.toString() || ""
        });
      }
    }
  }, [open, initialLocation]);

  // ⭐ INIT MAP + GPS
  useEffect(() => {
    if (!open) return;

    map.current = L.map(mapRef.current).setView([20.6, 78.9], 5);

    // Satellite
    L.tileLayer(
      `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
      { crossOrigin: true }
    ).addTo(map.current);

    // ⭐ MULTIPLE MARKERS SHOW
    if (allLocations?.length > 0) {
      allLocations.forEach((loc) => {
        L.marker([loc.lat, loc.lng], { icon: customMarkerIcon }).addTo(map.current);
      });
    }

    // ⭐ If reopening restored saved location
    if (selectedLocation?.lat) {
      placeMarker(selectedLocation.lat, selectedLocation.lng);
    } 
    else {
      // ⭐ Try LIVE LOCATION
      getUserLocation()
        .then((loc) => placeMarker(loc.lat, loc.lng))
        .catch(() => console.log("GPS OFF. Using default India."));
    }

    // ⭐ Click NEW LOCATION
    map.current.on("click", (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setCoordinates({
        lat: lat.toFixed(6),
        lng: lng.toFixed(6)
      });
      placeMarker(lat, lng);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto">
      {/* Main Container */}
      <div className="min-h-screen flex items-start justify-center p-0 lg:p-4">
        <div className="bg-white dark:bg-gray-900 w-full min-h-screen lg:min-h-0 lg:rounded-xl lg:shadow-2xl lg:max-w-7xl lg:my-8 overflow-hidden">
          {/* Header - Fixed */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-4 sm:px-6 py-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-white dark:bg-blue-900 p-2 rounded-lg">
                  <span className="text-2xl">📍</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Select Project Location</h2>
                  <p className="text-blue-100 dark:text-blue-200 text-sm mt-1">
                    Search by place name or coordinates • Click on map to select
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-xl ml-auto sm:ml-0"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Map (70%) */}
            <div className="lg:w-2/3 p-4 sm:p-6 border-r border-gray-200 dark:border-gray-700">
              {/* Search Tabs */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                  <button
                    onClick={() => setSearchType("place")}
                    className={`px-4 py-2 font-medium text-sm ${searchType === "place" 
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"}`}
                  >
                    Search by Place Name
                  </button>
                  <button
                    onClick={() => setSearchType("coordinates")}
                    className={`px-4 py-2 font-medium text-sm ${searchType === "coordinates" 
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"}`}
                  >
                    Search by Coordinates
                  </button>
                </div>

                {/* Place Name Search */}
                {searchType === "place" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search by Place Name
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 flex">
                        <input
                          type="text"
                          placeholder="City, village, landmark, address..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-l-lg sm:rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <button
                          onClick={searchPlaces}
                          disabled={isSearching}
                          className="sm:hidden px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg
                            transition-colors duration-200 disabled:opacity-50"
                        >
                          {isSearching ? "..." : "🔍"}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={searchPlaces}
                          disabled={isSearching}
                          className="hidden sm:inline-flex px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                            transition-colors duration-200 disabled:opacity-50 items-center gap-2"
                        >
                          {isSearching ? "Searching..." : "Search"}
                        </button>
                        <button
                          onClick={() => {
                            getUserLocation()
                              .then((loc) => {
                                setCoordinates({
                                  lat: loc.lat.toFixed(6),
                                  lng: loc.lng.toFixed(6)
                                });
                                placeMarker(loc.lat, loc.lng);
                              })
                              .catch(() => alert("Please enable location services"));
                          }}
                          className="px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg
                            transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                        >
                          <span>📍</span>
                          <span className="hidden sm:inline">Current Location</span>
                          <span className="sm:hidden">Live</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Coordinates Search */}
                {searchType === "coordinates" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search by Coordinates
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Latitude</label>
                        <input
                          type="text"
                          placeholder="e.g., 18.5204"
                          value={coordinates.lat}
                          onChange={(e) => setCoordinates({...coordinates, lat: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Longitude</label>
                        <input
                          type="text"
                          placeholder="e.g., 73.8567"
                          value={coordinates.lng}
                          onChange={(e) => setCoordinates({...coordinates, lng: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={searchByCoordinates}
                        disabled={isSearching}
                        className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg
                          transition-colors duration-200 disabled:opacity-50"
                      >
                        {isSearching ? "Searching..." : "📍 Search by Coordinates"}
                      </button>
                      <button
                        onClick={() => {
                          if (selectedLocation?.lat && selectedLocation?.lng) {
                            setCoordinates({
                              lat: selectedLocation.lat.toFixed(6),
                              lng: selectedLocation.lng.toFixed(6)
                            });
                          }
                        }}
                        className="px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg
                          transition-colors duration-200 flex items-center gap-2"
                      >
                        Use Current Marker
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Format: Decimal degrees (e.g., 18.5204, 73.8567) • Range: Lat: -90 to 90, Lng: -180 to 180
                    </p>
                  </div>
                )}

                {/* Search Results */}
                {results.length > 0 && searchType === "place" && (
                  <div className="mt-4 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Search Results ({results.length})
                      </p>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {results.map((r, i) => (
                        <div
                          key={i}
                          className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0
                            hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          onClick={() => {
                            setSearch(r.display_name);
                            setResults([]);
                            setCoordinates({
                              lat: Number(r.lat).toFixed(6),
                              lng: Number(r.lon).toFixed(6)
                            });
                            placeMarker(Number(r.lat), Number(r.lon));
                          }}
                        >
                          <p className="text-gray-800 dark:text-gray-200 font-medium truncate">{r.display_name}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {r.type} • {Number(r.lat).toFixed(6)}, {Number(r.lon).toFixed(6)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Map Container */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Interactive Map</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                    <p>Click anywhere on map to place marker</p>
                    <p className="text-xs">Satellite view • Scroll to zoom</p>
                  </div>
                </div>
                
                {/* Map */}
                <div 
                  key={mapKey} 
                  ref={mapRef} 
                  className="w-full h-[50vh] sm:h-[60vh] lg:h-[65vh] rounded-xl border-2 border-gray-300 dark:border-gray-700 
                    overflow-hidden shadow-lg"
                />
                
                {/* Map Controls Info */}
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Selected Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Saved Locations ({allLocations?.length || 0})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span>Click map to add new</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details & Actions (30%) */}
            <div className="lg:w-1/3 p-4 sm:p-6">
              {/* Selected Location Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Location Details
                </h3>
                
                {selectedLocation ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Coordinates</span>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-gray-800 dark:text-gray-200 text-sm flex-1">
                            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                          </p>
                          <button
                            onClick={() => {
                              setCoordinates({
                                lat: selectedLocation.lat.toFixed(6),
                                lng: selectedLocation.lng.toFixed(6)
                              });
                              setSearchType("coordinates");
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            Copy to Search
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</span>
                          <p className="text-gray-800 dark:text-gray-200 text-sm mt-1 line-clamp-3">
                            {selectedLocation.address || "No address available"}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Taluka</span>
                            <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                              {selectedLocation.taluka || "—"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">District</span>
                            <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                              {selectedLocation.district || "—"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">State</span>
                            <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                              {selectedLocation.state || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${selectedLocation.lat}, ${selectedLocation.lng}`);
                            alert("Coordinates copied!");
                          }}
                          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                            text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          Copy Coordinates
                        </button>
                        <button
                          onClick={() => {
                            const url = `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}`;
                            window.open(url, '_blank');
                          }}
                          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                            text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          Open in Maps
                        </button>
                        <button
                          onClick={() => {
                            setCoordinates({
                              lat: selectedLocation.lat.toFixed(6),
                              lng: selectedLocation.lng.toFixed(6)
                            });
                            setSearchType("coordinates");
                          }}
                          className="px-3 py-2 bg-purple-200 dark:bg-purple-700 hover:bg-purple-300 dark:hover:bg-purple-600 
                            text-purple-700 dark:text-purple-300 rounded-lg text-sm transition-colors"
                        >
                          Use in Coordinates Search
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-2xl text-gray-400">📍</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">No location selected</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Click on map or search to select a location
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 
                        text-gray-700 dark:text-gray-300 font-medium rounded-lg
                        hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => selectedLocation && onSave(selectedLocation)}
                      disabled={!selectedLocation}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg
                        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Location
                    </button>
                  </div>
                  
                  {/* Help Text */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location will be added to your project form
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      You can add multiple locations
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">How to use:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span><strong>Search by Place:</strong> Enter city, village, landmark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span><strong>Search by Coordinates:</strong> Enter Lat, Lng (e.g., 18.5204, 73.8567)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>Click anywhere on the map to place marker</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>Use "Current Location" for GPS position</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;