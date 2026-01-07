import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const DashboardMap = ({ reports }) => {
    const [markers, setMarkers] = useState([]);

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Potholes / Road Damage': return '#ef4444';
            case 'Illegal Construction': return '#fcd34d';
            case 'Stray Cattle': return '#a855f7';
            case 'Garbage / Drainage': return '#22c55e';
            case 'Other': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const createCustomIcon = (category) => {
        const color = getCategoryColor(category);
        const svgIcon = (
            <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71573 23.2843 0 15 0Z" fill={color} />
                <circle cx="15" cy="15" r="5" fill="white" />
            </svg>
        );

        return L.divIcon({
            html: renderToStaticMarkup(svgIcon),
            className: 'custom-marker-icon',
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -42]
        });
    };

    useEffect(() => {
        const parsedMarkers = reports
            .map(report => {
                let lat, lng;

                if (report.latitude && report.longitude) {
                    lat = report.latitude;
                    lng = report.longitude;
                }
                else if (report.location) {
                    const coords = report.location.match(/Lat: ([\d.-]+), Long: ([\d.-]+)/);
                    if (coords) {
                        lat = parseFloat(coords[1]);
                        lng = parseFloat(coords[2]);
                    }
                }

                if (lat && lng) {
                    return {
                        id: report.id,
                        lat,
                        lng,
                        location: report.location,
                        category: report.selectedCategory,
                        description: report.description
                    };
                }
                return null;
            })
            .filter(marker => marker !== null);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMarkers(parsedMarkers);
    }, [reports]);

    const categories = [
        { label: 'Potholes', color: '#ef4444' },
        { label: 'Construction', color: '#fcd34d' },
        { label: 'Cattle', color: '#a855f7' },
        { label: 'Garbage', color: '#22c55e' },
        { label: 'Other', color: '#3b82f6' }
    ];

    return (
        <div className="w-full h-100 rounded-2xl overflow-hidden shadow-sm border border-stone-100 z-0 relative">
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
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        icon={createCustomIcon(marker.category)}
                    >
                        <Tooltip direction="top" offset={[0, -42]} opacity={1}>
                            <span className="font-medium text-xs text-[#1a1a1a]">{marker.location}</span>
                        </Tooltip>
                        <Popup>
                            <div className="min-w-37.5">
                                <strong className="block mb-1 text-sm font-bold text-[#1a1a1a]" style={{ color: getCategoryColor(marker.category) }}>{marker.category}</strong>
                                <p className="text-xs text-stone-600 line-clamp-2">{marker.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-stone-100 z-1000 text-xs">
                <div className="font-bold text-[#1a1a1a] mb-2">Legend</div>
                <div className="space-y-1.5">
                    {categories.map((cat) => (
                        <div key={cat.label} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                            <span className="text-stone-600 font-medium">{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardMap;
