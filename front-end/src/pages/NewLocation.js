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
        tags: '',
        image: null,
        visibility: '1' // 1: public, 2: friends only, 3: private
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [missingLocation, setMissingLocation] = useState(false);
    const [locationName, setLocationName] = useState('Loading location...');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            
            console.log('Sending location name:', locationName);
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const token = localStorage.getItem('token');
            console.log('Form data being sent:', Object.fromEntries(formDataToSend));
            const response = await axios.post('http://localhost:4000/', formDataToSend, {
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
        <div className="h-screen bg-white overflow-y-auto">
            <div className="max-w-md mx-auto bg-white">
                <div className="p-4">
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

                        <div className="flex justify-end space-x-4 pb-4">
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
            </div>
        </div>
    );
};

export default NewLocation;