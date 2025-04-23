import React, { useState, useEffect } from "react";
import PinIcon from "./icons/PinIcon";
import axios from 'axios';

const LocationItem = ({ location, removeLocation }) => {
    const [expanded, setExpanded] = useState(false);
    const [author, setAuthor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAuthor = async () => {
            if (!location.author) return;
            
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_user/${location.author}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.data) {
                    setAuthor(response.data);
                }
            } catch (error) {
                console.error('Error fetching author:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuthor();
    }, [location.author]);

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    const getVisibilityBadge = () => {
        if (!location.visibility) {
            return { label: 'Public', bgColor: 'bg-green-100', textColor: 'text-green-800' };
        }
        
        switch(location.visibility) {
            case '1':
            case 1:
                return { label: 'Public', bgColor: 'bg-green-100', textColor: 'text-green-800' };
            case '2':
            case 2:
                return { label: 'Friends', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
            case '3':
            case 3:
                return { label: 'Private', bgColor: 'bg-red-100', textColor: 'text-red-800' };
            default:
                return { label: 'Public', bgColor: 'bg-green-100', textColor: 'text-green-800' };
        }
    };
    
    const visibilityBadge = getVisibilityBadge();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="bg-white rounded-lg shadow mb-4 overflow-hidden w-full">
            <div className="flex items-center p-3 border-b">
                {isLoading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mr-2"></div>
                ) : (
                    <img 
                        src={author?.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
                        alt={author?.username || "User"} 
                        className="h-8 w-8 rounded-full object-cover mr-2"
                    />
                )}
                <div className="flex-1">
                    <p className="font-medium text-sm flex items-center">
                        <PinIcon className="w-4 h-4 mr-1" />
                        {author?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{location.locationName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${visibilityBadge.bgColor} ${visibilityBadge.textColor}`}>
                    {visibilityBadge.label}
                </span>
            </div>
            
            <div className="w-full">
                <img 
                    src={location.imageUrl} 
                    alt={location.title} 
                    className="w-full h-64 object-cover"
                />
            </div>
            
            <div className="p-3 border-b">
                <h3 className="font-bold text-lg mb-1">{location.title}</h3>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{formatDate(location.createdAt)}</p>
                </div>
            </div>
            
            <div className="p-3">
                {location.description && (
                    <>
                        <p className={expanded ? "text-sm" : "text-sm line-clamp-2"}>
                            {location.description}
                        </p>
                        {location.description.length > 80 && (
                            <button 
                                onClick={toggleDescription}
                                className="text-blue-500 text-xs mt-1 font-medium"
                            >
                                {expanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LocationItem;