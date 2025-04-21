import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const pinIconSvgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-6"> <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" /> </svg>`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: pinIconSvgUrl,
  iconUrl: pinIconSvgUrl,
  shadowUrl: ''
});

const MapPin = ({ pinData, onDelete }) => {
  const { 
    id,
    latitude, 
    longitude, 
    title, 
    imageUrl, 
    description,
    createdAt,
    locationName,
    tags
  } = pinData;

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [, setIsLoadingFriends] = useState(false);

  useEffect(() => {
    if (tags && tags.length > 0) {
      const fetchTaggedFriends = async () => {
        setIsLoadingFriends(true);
        try {
          const token = localStorage.getItem('token');
          const friendsData = [];
          
          for (const tagId of tags) {
            try {
              const response = await axios.get(`http://localhost:4000/get_user/${tagId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (response.data) {
                friendsData.push(response.data);
              }
            } catch (err) {
              console.error(`Error fetching user with ID ${tagId}:`, err);
            }
          }
          
          setTaggedFriends(friendsData);
        } catch (err) {
          console.error('Error fetching tagged friends:', err);
        } finally {
          setIsLoadingFriends(false);
        }
      };
      
      fetchTaggedFriends();
    }
  }, [tags]);

  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:4000/delete', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: { pinId: id }
      });
      
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Error deleting pin:', error);
      alert('Failed to delete pin. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Marker position={[latitude, longitude]}>
      <Popup className="custom-popup">
        <div className="w-72 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                {locationName && (
                  <p className="text-sm text-gray-500 mt-1">{locationName}</p>
                )}
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {imageUrl && (
              <div className="relative mb-3 rounded-lg overflow-hidden transition-opacity duration-200">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-40 object-cover cursor-pointer hover:opacity-90"
                  onClick={() => window.open(imageUrl, '_blank')}
                />
                <button
                  onClick={() => window.open(imageUrl, '_blank')}
                  className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded hover:bg-opacity-90 transition-all duration-200"
                >
                  Click to view full size
                </button>
              </div>
            )}

            <div className="mb-3">
              <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
              {description && description.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-500 text-xs mt-1 hover:underline transition-colors duration-200"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {taggedFriends.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Tagged Friends:</p>
                <div className="flex flex-wrap gap-2">
                  {taggedFriends.map(friend => (
                    <div key={friend._id} className="flex items-center bg-gray-100 rounded-full p-1 pr-3">
                      <img 
                        src={friend.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
                        alt={friend.username} 
                        className="w-5 h-5 rounded-full mr-1"
                      />
                      <span className="text-xs text-gray-700">{friend.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>

          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-90 p-4 flex flex-col justify-center items-center transition-opacity duration-300">
              <p className="text-center mb-4 text-white">Are you sure you want to delete this pin?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 disabled:bg-red-300"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default MapPin;