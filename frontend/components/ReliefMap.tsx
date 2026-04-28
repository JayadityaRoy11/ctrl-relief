"use client";

import { useEffect, useState } from "react";

export type ReliefMapMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  subtitle?: string;
  detail?: string;
  urgency?: "High" | "Medium" | "Low";
};

type ReliefMapProps = {
  markers?: ReliefMapMarker[];
  height?: string;
  className?: string;
  title?: string;
  showLegend?: boolean;
};

export default function ReliefMap({ 
  markers = [], 
  height = "400px", 
  className = "",
  title = "",
  showLegend = true 
}: ReliefMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Map placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        {/* Mock map elements */}
        {(title || title === "") && (
          <div className="absolute top-4 left-4 bg-white rounded shadow p-2">
            <div className="text-xs font-semibold text-gray-700">
              {title || "Map View"}
            </div>
          </div>
        )}
        
        {/* Mock markers */}
        {markers.slice(0, 3).map((marker, index) => (
          <div
            key={marker.id}
            className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
            style={{
              top: `${20 + (index * 30)}%`,
              left: `${15 + (index * 25)}%`,
            }}
            title={marker.name}
          >
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 opacity-30 rounded-full animate-ping"></div>
          </div>
        ))}
        
        {/* Map controls */}
        <div className="absolute bottom-4 right-4 bg-white rounded shadow p-1">
          <div className="flex flex-col space-y-1">
            <button className="w-8 h-8 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">+</button>
            <button className="w-8 h-8 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">-</button>
          </div>
        </div>
      </div>
      
      {/* Marker info */}
      {showLegend && markers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded shadow p-3 max-w-xs">
          <div className="text-xs font-semibold text-gray-700 mb-1">
            {markers.length} locations found
          </div>
          <div className="text-xs text-gray-600">
            Showing nearby volunteers and NGOs
          </div>
        </div>
      )}
    </div>
  );
}
