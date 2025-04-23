import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import axios from 'axios';

const NewLocation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { lat, lng } = location.state || {};
    const fromMap = location.state?.fromMap ?? false;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null,
        visibility: '1' // 1: public, 2: friends only, 3: private
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [missingLocation, setMissingLocation] = useState(false);
    const [locationName, setLocationName] = useState('Loading location...');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [showTagFriendsPopup, setShowTagFriendsPopup] = useState(false);

    useEffect(() => {
        if (!lat || !lng) {
            setMissingLocation(true);
            navigate('/');
        } else {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => {
                    const street = data.address.road || '';
                    const city = data.address.city || data.address.town || data.address.village || '';
                    const country = data.address.country || '';
                    const name = `${street}${street && city ? ', ' : ''}${city}${city && country ? ', ' : ''}${country}`;
                    setLocationName(name || 'Unknown location');
                })
                .catch(err => {
                    console.error("Geocoding error:", err);
                    setLocationName('Unknown location');
                });
        }
    }, [lat, lng, navigate]);

    useEffect(() => {
        const fetchFriends = async () => {
            setIsLoadingFriends(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/query_friends`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data && Array.isArray(response.data)) {
                    setFriends(response.data);
                }
            } catch (err) {
                console.error('Error fetching friends:', err);
            } finally {
                setIsLoadingFriends(false);
            }
        };

        fetchFriends();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFriendSelect = (friendId) => {
        setSelectedFriends(prev => {
            if (prev.includes(friendId)) {
                return prev.filter(id => id !== friendId);
            } else {
                return [...prev, friendId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.title || !formData.description) {
            setError("Please fill out all fields.");
            setIsLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('latitude', lat);
            formDataToSend.append('longitude', lng);
            formDataToSend.append('visibility', formData.visibility);
            formDataToSend.append('locationName', locationName);
            
            if (selectedFriends.length > 0) {
                formDataToSend.append('tags', JSON.stringify(selectedFriends));
            }
            
            console.log('Sending location name:', locationName);
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const token = localStorage.getItem('token');
            console.log('Form data being sent:', Object.fromEntries(formDataToSend));
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/create`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            if (response.data) {
                navigate('/landing');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create pin');
        } finally {
            setIsLoading(false);
        }
    };

    const TagFriendsPopup = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4">
                <div className="bg-white rounded-lg shadow-xl w-full sm:w-[90%] max-w-sm h-[80vh] flex flex-col">
                    <div className="px-4 py-3 border-b flex justify-between items-center">
                        <h3 className="text-lg font-medium">Tag Friends</h3>
                        <button 
                            onClick={() => setShowTagFriendsPopup(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto flex-grow">
                        {isLoadingFriends ? (
                            <div className="flex justify-center items-center h-40">
                                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : friends.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No friends to tag</p>
                        ) : (
                            <div className="space-y-2">
                                {friends.map(friend => (
                                    <div 
                                        key={friend._id} 
                                        className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                                            selectedFriends.includes(friend._id) 
                                                ? 'bg-indigo-100 border border-indigo-300' 
                                                : 'hover:bg-gray-100 border border-transparent'
                                        }`}
                                        onClick={() => handleFriendSelect(friend._id)}
                                    >
                                        <div className="flex-shrink-0">
                                            <img 
                                                src={friend.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
                                                alt={friend.username} 
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-3 flex-grow">
                                            <p className="text-sm font-medium text-gray-900">{friend.username}</p>
                                        </div>
                                        {selectedFriends.includes(friend._id) && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
                        <div>
                            {selectedFriends.length > 0 && (
                                <p className="text-sm text-gray-600">
                                    {selectedFriends.length} friend{selectedFriends.length > 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowTagFriendsPopup(false)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (missingLocation && !fromMap) {
        return (
            <div className="flex flex-col mx-auto p-3 h-full items-center max-w-xl">
                <div className="text-xl font-bold p-3.5">New Location</div>
                <div className="text-red-600 font-semibold mb-4 text-center">
                    Please go back and right-click a spot on the map to choose a location first.
                </div>
                <div className="text-sm text-gray-600 mb-4 text-center">
                    This form is only enabled after selecting a location on the map by <strong>right-clicking</strong>.
                </div>
                <Button onClick={() => navigate('/landing')}>Go to Map</Button>
            </div>
        );
    }

    return (
        <div className="w-full absolute inset-0 overflow-y-auto bg-white">
            <div className="max-w-md mx-auto p-4 pb-20">
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">Location:</p>
                    <p className="text-sm font-medium text-gray-900">{locationName}</p>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows="3"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="1"
                                    checked={formData.visibility === '1'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Public</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="2"
                                    checked={formData.visibility === '2'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Friends Only</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value="3"
                                    checked={formData.visibility === '3'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Private</span>
                            </label>
                        </div>
                    </div>

                    {/* Tag Friends Button */}
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => setShowTagFriendsPopup(true)}
                            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            Tag Friends {selectedFriends.length > 0 ? `(${selectedFriends.length})` : ''}
                        </button>
                        
                        {/* Display selected friends below the button */}
                        {selectedFriends.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {friends
                                    .filter(friend => selectedFriends.includes(friend._id))
                                    .map(friend => (
                                        <div key={friend._id} className="flex items-center bg-indigo-100 rounded-full p-1 pr-3">
                                            <img 
                                                src={friend.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
                                                alt={friend.username} 
                                                className="w-5 h-5 rounded-full mr-1"
                                            />
                                            <span className="text-xs text-gray-700">{friend.username}</span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <div className="mb-4">
                                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto" />
                                    </div>
                                ) : (
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="image"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="image"
                                            name="image"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            required
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 100MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pb-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/landing')}
                            className="bg-gray-200 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${
                                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            } py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            {isLoading ? 'Creating...' : 'Create Pin'}
                        </button>
                    </div>
                </form>
            </div>

            {showTagFriendsPopup && <TagFriendsPopup />}
        </div>
    );
};

export default NewLocation;