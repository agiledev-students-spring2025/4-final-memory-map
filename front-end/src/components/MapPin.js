import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Marker, Popup } from 'react-leaflet';

const pinIconSvgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-6"> <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" /> </svg>`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: pinIconSvgUrl,
  iconUrl: pinIconSvgUrl,
  shadowUrl: ''
});

const MapPin = ({ pinData }) => {
  const { 
    pinLocationLatitude, 
    pinLocationLongitude, 
    pinName, 
    imageUrl, 
    pinLocationCity, 
    pinLocationCountry, 
    createdAt, 
    pinDescription 
  } = pinData;

  if (typeof pinLocationLatitude !== 'number' || typeof pinLocationLongitude !== 'number') return null;

  return (
    <Marker position={[pinLocationLatitude, pinLocationLongitude]}>
      <Popup>
        <div className="w-full max-w-full">
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-2">{pinName}</h2>
            <img
              src={imageUrl}
              alt={pinName}
              className="w-1/4 h-1/4 mb-2 rounded"
            />
            <button
              className="text-blue-500 underline text-xs mb-2"
              onClick={() => window.open(imageUrl, '_blank')}
            >
              View Original Size Image
            </button>
            <div className="text-sm text-gray-600 mb-2">
              {pinLocationCity}, {pinLocationCountry}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Created at: {createdAt}
            </div>
            <p className="text-gray-700">{pinDescription}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapPin;