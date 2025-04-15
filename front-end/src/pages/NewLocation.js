import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import axios from 'axios';

const NewLocation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const lat = location.state?.latitude ?? '';
    const lng = location.state?.longitude ?? '';
    const fromMap = location.state?.fromMap ?? false;

    const [postData, setPostData] = useState({
        title: '',
        description: '',
        latitude: lat,
        longitude: lng,
        visibility: '1' // 1: public, 2: friends only, 3: private
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [missingLocation, setMissingLocation] = useState(false);
    const [cityCountry, setCityCountry] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!lat || !lng) {
            setMissingLocation(true);
        } else {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => {
                    const city = data.address.city || data.address.town || data.address.village || '';
                    const country = data.address.country || '';
                    setCityCountry(`${city}${city && country ? ', ' : ''}${country}`);
                })
                .catch(err => {
                    console.error("Geocoding error:", err);
                    setCityCountry('Unknown location');
                });
        }
    }, [lat, lng]);

    const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!postData.title || !postData.description) {
            setError("Please fill out all fields.");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('description', postData.description);
        formData.append('latitude', postData.latitude);
        formData.append('longitude', postData.longitude);
        formData.append('visibility', postData.visibility);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:4000/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message === 'Pin created successfully') {
                navigate('/landing');
            } else {
                setError('Failed to create pin. Please try again.');
            }
        } catch (error) {
            console.error('Create pin error:', error);
            setError(error.response?.data?.error || 'Failed to create pin. Please try again.');
        } finally {
            setIsSubmitting(false);
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
        <div className="flex flex-col mx-auto p-4 h-full">
            <h2 className="text-left text-2xl font-bold text-black-500">Create New Pin</h2>
            {error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form className="mt-2 w-full flex-1 overflow-y-auto" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={postData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter pin title"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={postData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter pin description"
                        rows="4"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-gray-700"
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Visibility</label>
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="visibility"
                                value="1"
                                checked={postData.visibility === '1'}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-500"
                            />
                            <span className="text-gray-700">Public</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="visibility"
                                value="2"
                                checked={postData.visibility === '2'}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-500"
                            />
                            <span className="text-gray-700">Friends Only</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="visibility"
                                value="3"
                                checked={postData.visibility === '3'}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-500"
                            />
                            <span className="text-gray-700">Private</span>
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Location</label>
                    <div className="text-md font-bold text-gray-600">
                        {cityCountry || `${lat}, ${lng}`}
                    </div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Pin'}
                </Button>
            </form>
        </div>
    );
};

export default NewLocation;