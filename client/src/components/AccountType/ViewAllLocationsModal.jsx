import React from "react";

const ViewAllLocationsModal = ({ open, onClose, locations, onRemoveLocation }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4">
        <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-blue-900 p-2 rounded-lg">
                  <span className="text-2xl"></span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">All Project Locations</h2>
                  <p className="text-blue-100 dark:text-blue-200 text-sm">
                    {locations.length} location{locations.length !== 1 ? 's' : ''} in your project
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {locations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-3xl text-gray-400">📍</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">No locations added yet</p>
                <p className="text-gray-500 dark:text-gray-500 mt-2">
                  Add locations from the main form
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{locations.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Locations</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {new Set(locations.map(loc => loc.district)).size}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Districts</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {new Set(locations.map(loc => loc.taluka)).size}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Talukas</p>
                  </div>
                </div>

                {/* Locations List */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {locations.map((loc, idx) => (
                    <div
                      key={idx}
                      className="
                        bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                        rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors
                      "
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold">{idx + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              Location {idx + 1}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Added on {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onRemoveLocation(idx);
                            if (locations.length === 1) onClose();
                          }}
                          className="
                            px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400
                            hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium
                            transition-colors flex items-center gap-2
                          "
                        >
                          <span>🗑</span>
                          Remove
                        </button>
                      </div>

                      {/* Location Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Address</p>
                            <p className="text-gray-800 dark:text-gray-200">
                              {loc.address || "No address available"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Coordinates</p>
                            <p className="font-mono text-gray-800 dark:text-gray-200">
                              {loc.lat ? loc.lat.toFixed(6) : "—"}, {loc.lng ? loc.lng.toFixed(6) : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Taluka</p>
                              <p className="text-gray-800 dark:text-gray-200">
                                {loc.taluka || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">District</p>
                              <p className="text-gray-800 dark:text-gray-200">
                                {loc.district || "—"}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">State</p>
                              <p className="text-gray-800 dark:text-gray-200">
                                {loc.state || "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${loc.lat}, ${loc.lng}`);
                            alert("Coordinates copied!");
                          }}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                            text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                        >
                          Copy Coordinates
                        </button>
                        {loc.lat && loc.lng && (
                          <button
                            onClick={() => {
                              const url = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
                              window.open(url, '_blank');
                            }}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                              text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
                          >
                            Open in Google Maps
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const text = `Location ${idx + 1}:\nAddress: ${loc.address}\nCoordinates: ${loc.lat}, ${loc.lng}\nTaluka: ${loc.taluka}\nDistrict: ${loc.district}\nState: ${loc.state}`;
                            navigator.clipboard.writeText(text);
                            alert("Location details copied!");
                          }}
                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 
                            text-blue-700 dark:text-blue-400 rounded-lg text-sm transition-colors"
                        >
                          Copy Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map View Button */}
                {locations.length > 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      All {locations.length} locations are shown above
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          const coords = locations.map(loc => `${loc.lat},${loc.lng}`).join('|');
                          const url = `https://www.google.com/maps/dir/${coords}`;
                          window.open(url, '_blank');
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                      >
                        🗺 View Route on Google Maps
                      </button>
                      <button
                        onClick={() => {
                          const text = locations.map((loc, idx) => 
                            `Location ${idx + 1}: ${loc.address} (${loc.lat}, ${loc.lng})`
                          ).join('\n\n');
                          navigator.clipboard.writeText(text);
                          alert("All locations copied!");
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                      >
                        📋 Copy All Locations
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Close Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                  text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllLocationsModal;