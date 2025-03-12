import React, {useState } from "react";
import {useNavigate } from 'react-router-dom';
import Button from "../components/Button";

const NewLocation = () => {
    const navigate = useNavigate();
    const [postData, setPostData] = useState({
        locationLatitude: '',
        locationLongitude: '',
        locationCity: '',
        locationCountry: '',
        pinName: '',
        pinDescription: '',
        imageUrl: '',
    })

    const handleChange = (event) => {
        setPostData({...postData, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!postData.locationCity || !postData.locationCountry  || !postData.pinDescription || !postData.pinName || !postData.imageUrl) {
            alert("Please enter all fields");
            return;
        }
        try {
            const response = await fetch('https://my.api.mockaroo.com/location_schema.json?key=e924a6e0&__method=POST', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
    
            if (response.ok) {
                console.log('New location created');
                navigate("/");
            } else {
                console.error('Error occured:', response.status);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
        
    };

    return (
        <div className="flex flex-col mx-auto p-3 h-full items-center">
            <div className="text-xl font-bold p-3.5">New Location</div>
            <form className="mt-2" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Location name</label>
                        <input
                            type="text"
                            name="pinName"
                            value={postData.pinName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter pin name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Location description</label>
                        <input
                            type="text"
                            name="pinDescription"
                            value={postData.pinDescription}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter pin description"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Location city</label>
                        <input
                            type="text"
                            name="locationCity"
                            value={postData.locationCity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter location city"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Location country</label>
                        <input
                            type="text"
                            name="locationCountry"
                            value={postData.locationCountry}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter location country"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Location image</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={postData.imageUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter image url"
                        />
                    </div>
                    
                    <Button onClick={handleSubmit}>Create New Location</Button>
                </form>
        </div>
    )
}

export default NewLocation;