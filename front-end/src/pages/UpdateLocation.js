import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import axios from 'axios';

const VISIBILITY = {
    PRIVATE: '1',
    FRIENDS: '2',
    PUBLIC: '3'
};

const VISIBILITY_LABELS = {
    [VISIBILITY.PRIVATE]: "Private (Only You)",
    [VISIBILITY.FRIENDS]: "Friends Only",
    [VISIBILITY.PUBLIC]: "Public (Everyone)"
};

const UpdateLocation = (locationData) => {
    let { 
        title, 
        imageUrl, 
        description,
        tags,
        visibility,
      } = locationData;

    // const location = useLocation();
    const navigate = useNavigate();

    // const { lat, lng, defaultVisibility } = location.state || {};
    // const fromMap = location.state?.fromMap ?? false;

    const [formData, setFormData] = useState({
        title: title,
        description: description,
        image: null,
        visibility: visibility
    });
    const [imagePreview, setImagePreview] = useState(null);
    // const [missingLocation, setMissingLocation] = useState(false);
    // const [locationName, setLocationName] = useState('Loading location...');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [showTagFriendsPopup, setShowTagFriendsPopup] = useState(false);

    // useEffect(() => {
    //     if (!lat || !lng) {
    //         setMissingLocation(true);
    //         navigate('/');
    //     } else {
    //         fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
    //             .then(res => res.json())
    //             .then(data => {
    //                 const street = data.address.road || '';
    //                 const city = data.address.city || data.address.town || data.address.village || '';
    //                 const country = data.address.country || '';
    //                 const name = `${street}${street && city ? ', ' : ''}${city}${city && country ? ', ' : ''}${country}`;
    //                 setLocationName(name || 'Unknown location');
    //             })
    //             .catch(err => {
    //                 console.error("Geocoding error:", err);
    //                 setLocationName('Unknown location');
    //             });
    //     }
    // }, [lat, lng, navigate]);

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
            // formDataToSend.append('latitude', lat);
            // formDataToSend.append('longitude', lng);
            formDataToSend.append('visibility', formData.visibility);
            // formDataToSend.append('locationName', locationName);
            
            if (selectedFriends.length > 0) {
                formDataToSend.append('tags', JSON.stringify(selectedFriends));
            }
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const token = localStorage.getItem('token');
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

    // if (missingLocation && !fromMap) {
    //     return (
    //         <div className="flex flex-col mx-auto p-3 h-full items-center max-w-xl">
    //             <div className="text-xl font-bold p-3.5">New Location</div>
    //             <div className="text-red-600 font-semibold mb-4 text-center">
    //                 Please go back and right-click a spot on the map to choose a location first.
    //             </div>
    //             <div className="text-sm text-gray-600 mb-4 text-center">
    //                 This form is only enabled after selecting a location on the map by <strong>right-clicking</strong>.
    //             </div>
    //             <Button onClick={() => navigate('/landing')}>Go to Map</Button>
    //         </div>
    //     );
    // }

    return (
        <div className="flex flex-col mx-auto p-3 h-full max-w-xl overflow-auto pb-20">
            <div className="text-xl font-bold p-3.5">New Memory</div>
            
            <div className="mb-4">
                <div className="flex gap-2 items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {/* <span className="text-sm text-gray-600">{locationName}</span> */}
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Add a title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Add a description"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-500 rounded-lg shadow-lg tracking-wide border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                            {imagePreview ? (
                                <div className="relative w-full">
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, image: null }));
                                            setImagePreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="mt-2 text-sm">Select an image</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                    <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value={VISIBILITY.PRIVATE}>{VISIBILITY_LABELS[VISIBILITY.PRIVATE]}</option>
                        <option value={VISIBILITY.FRIENDS}>{VISIBILITY_LABELS[VISIBILITY.FRIENDS]}</option>
                        <option value={VISIBILITY.PUBLIC}>{VISIBILITY_LABELS[VISIBILITY.PUBLIC]}</option>
                    </select>
                </div>
                
                <div>
                    <button
                        type="button"
                        onClick={() => setShowTagFriendsPopup(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Tag Friends {selectedFriends.length > 0 && `(${selectedFriends.length})`}
                    </button>
                    
                    {selectedFriends.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {selectedFriends.map(friendId => {
                                const friend = friends.find(f => f._id === friendId);
                                if (!friend) return null;
                                
                                return (
                                    <span key={friendId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {friend.username}
                                        <button
                                            type="button"
                                            onClick={() => handleFriendSelect(friendId)}
                                            className="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {error && (
                    <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
                        {error}
                    </div>
                )}
                
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/landing')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Saving...' : 'Save Memory'}
                    </button>
                </div>
            </form>
            
            {showTagFriendsPopup && <TagFriendsPopup />}
        </div>
    );
};

export default UpdateLocation;