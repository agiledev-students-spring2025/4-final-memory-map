import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../components/Button";

const NewLocation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const lat = location.state?.latitude ?? '';
    const lng = location.state?.longitude ?? '';
    const fromMap = location.state?.fromMap ?? false;

    const [postData, setPostData] = useState({
        locationLatitude: lat,
        locationLongitude: lng,
        pinName: '',
        pinDescription: '',
        visibility: '1', // 1: public, 2: friends only, 3: private
    });

    const [imageFile, setImageFile] = useState(null);
    const [missingLocation, setMissingLocation] = useState(false);
    const [cityCountry, setCityCountry] = useState('');

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
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postData.pinName || !postData.pinDescription || !imageFile) {
            alert("Please fill out all fields and upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append('pinName', postData.pinName);
        formData.append('pinDescription', postData.pinDescription);
        formData.append('locationLatitude', postData.locationLatitude);
        formData.append('locationLongitude', postData.locationLongitude);
        formData.append('visibility', postData.visibility);
        formData.append('image', imageFile);

        try {
            const response = await fetch("http://localhost:4000/create_pin", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Location created successfully!");
                navigate("/landing");
            } else {
                console.error("Upload failed:", response.status);
            }
        } catch (error) {
            console.error("Network error:", error);
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
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">New Location</h1>
            <form
                className="space-y-5"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <div>
                    <label className="block text-gray-800 font-medium mb-1">Latitude</label>
                    <input
                        type="text"
                        name="locationLatitude"
                        value={postData.locationLatitude}
                        readOnly
                        className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-800 font-medium mb-1">Longitude</label>
                    <input
                        type="text"
                        name="locationLongitude"
                        value={postData.locationLongitude}
                        readOnly
                        className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-800 font-medium mb-1">City, Country</label>
                    <div className="w-full px-4 py-2 bg-gray-50 border rounded-md text-gray-600">
                        {cityCountry || 'Loading...'}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-800 font-medium mb-1">Location Name</label>
                    <input
                        type="text"
                        name="pinName"
                        value={postData.pinName}
                        onChange={handleChange}
                        placeholder="Enter location name"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-800 font-medium mb-1">Description</label>
                    <input
                        type="text"
                        name="pinDescription"
                        value={postData.pinDescription}
                        onChange={handleChange}
                        placeholder="Enter description"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-800 font-medium mb-2">Visibility</label>
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

                <div>
                    <label className="block text-gray-800 font-medium mb-1">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-gray-700"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Create New Location
                </button>
            </form>
        </div>
    );
};

export default NewLocation;