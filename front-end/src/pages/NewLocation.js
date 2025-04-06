import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../components/Button";

const NewLocation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const lat = location.state?.latitude ?? '';
    const lng = location.state?.longitude ?? '';

    const [postData, setPostData] = useState({
        locationLatitude: lat,
        locationLongitude: lng,
        pinName: '',
        pinDescription: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [missingLocation, setMissingLocation] = useState(false);

    useEffect(() => {
        if (!lat || !lng) {
            setMissingLocation(true);
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

    return (
        <div className="flex flex-col mx-auto p-3 h-full items-center max-w-xl">
            <div className="text-xl font-bold p-3.5">New Location</div>

            {missingLocation && (
                <>
                    <div className="text-red-600 font-semibold mb-4 text-center">
                        Please go back and right-click a spot on the map to choose a location first.
                    </div>
                    <div className="text-sm text-gray-600 mb-4 text-center">
                        This form is only enabled after selecting a location on the map by <strong>right-clicking</strong>.
                    </div>
                </>
            )}

            <form
                className="mt-2 w-full"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <div className="mb-4">
                    <label className="block text-gray-700">Latitude</label>
                    <input
                        type="text"
                        name="locationLatitude"
                        value={postData.locationLatitude}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Longitude</label>
                    <input
                        type="text"
                        name="locationLongitude"
                        value={postData.locationLongitude}
                        onChange={handleChange}
                        readOnly
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Location name</label>
                    <input
                        type="text"
                        name="pinName"
                        value={postData.pinName}
                        onChange={handleChange}
                        disabled={missingLocation}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter pin name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <input
                        type="text"
                        name="pinDescription"
                        value={postData.pinDescription}
                        onChange={handleChange}
                        disabled={missingLocation}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter description"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={missingLocation}
                        className="w-full"
                    />
                </div>

                <Button type="submit" disabled={missingLocation}>
                    Create New Location
                </Button>
            </form>
        </div>
    );
};

export default NewLocation;