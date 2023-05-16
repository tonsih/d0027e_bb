import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';
import '../scss/ImageMap.scss';

function ImageMap({ coordinates, image }) {
	const [coordString, setCoordString] = useState(coordinates);

	let defaultIcon = L.icon({
		iconUrl: icon,
		shadowUrl: iconShadow,
	});

	L.Marker.prototype.options.icon = defaultIcon;

	// const convertCoordinates = coordString => {
	// 	const [latStr, lonStr] = coordString.split(/[, ]+/);
	// 	const lat = parseFloat(latStr.replace(/[^0-9.]/g, ''));
	// 	const lon = parseFloat(lonStr.replace(/[^0-9.]/g, ''));
	// 	const latitude = latStr.includes('S') ? -lat : lat;
	// 	const longitude = lonStr.includes('W') ? -lon : lon;
	// 	return { latitude, longitude };
	// };

	const convertCoordinates = coordString => {
		const [latStr, lonStr] = coordString.split(/, /);

		// Parse latitude degrees, minutes, seconds, and direction
		const [latDegrees, latMinutesDir] = latStr.split(/[, ]+/);
		const latMinutes = parseFloat(latMinutesDir);
		const lat = parseFloat(latDegrees) + latMinutes / 60;
		const latitude = latMinutesDir.includes('S') ? -lat : lat;

		// Parse longitude degrees, minutes, seconds, and direction
		const [lonDegrees, lonMinutesDir] = lonStr.split(/[, ]+/);
		const lonMinutes = parseFloat(lonMinutesDir);
		const lon = parseFloat(lonDegrees) + lonMinutes / 60;
		const longitude = lonMinutesDir.includes('W') ? -lon : lon;

		return { latitude, longitude };
	};

	// Handle changes to the input field
	const handleInputChange = event => {
		setCoordString(event.target.value);
	};

	// Convert the coordinate string to decimal degrees
	const coords = convertCoordinates(coordString);

	if (isNaN(coords.latitude) || isNaN(coords.longitude)) {
		return <div>Invalid coordinates</div>;
	}

	// Render the map
	return (
		// <div>
		// 	<input type='text' value={coordString} readOnly />

		<MapContainer
			center={[coords.latitude, coords.longitude]}
			zoom={3}
			style={{ height: '400px' }}
		>
			<TileLayer
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
			/>
			<Marker position={[coords.latitude, coords.longitude]} icon={defaultIcon}>
				<Popup>
					Coordinates: {coords.latitude.toFixed(6)},{' '}
					{coords.longitude.toFixed(6)}
					<img
						className='w-100'
						alt={image?.image_id}
						src={
							image?.image_url || 'https://placehold.co/500x400?text=No+Image'
						}
					/>
				</Popup>
			</Marker>
		</MapContainer>
	);
}

export default ImageMap;
