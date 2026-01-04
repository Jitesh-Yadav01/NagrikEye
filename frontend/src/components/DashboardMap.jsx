import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DashboardMap = ({ reports }) => {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const parsedMarkers = reports
            .map(report => {
                if (!report.location) return null;

                const coords = report.location.match(/Lat: ([\d.-]+), Long: ([\d.-]+)/);
                if (coords) {
                    return {
                        id: report.id,
                        lat: parseFloat(coords[1]),
                        lng: parseFloat(coords[2]),
                        category: report.selectedCategory,
                        description: report.description
                    };
                }
                return null;
            })
            .filter(marker => marker !== null);

        setMarkers(parsedMarkers);
    }, [reports]);

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-stone-100 z-0">
            <MapContainer
                center={[18.6298, 73.7997]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers.map(marker => (
                    <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                        <Popup>
                            <div className="min-w-[150px]">
                                <strong className="block mb-1 text-sm font-bold text-[#1a1a1a]">{marker.category}</strong>
                                <p className="text-xs text-stone-600 line-clamp-2">{marker.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default DashboardMap;
