import React, {useEffect, useState} from 'react';
import Loading from '../components/Loading';
import axios from 'axios';

const Feeds = () => {
    const [pinnedLocations, setPinnedLocations] = useState(null);
    const [, setError] = useState(null);
    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          fetch('http://localhost:4000/query_feed', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to fetch feed');
              }
              return response.json();
            })
            .then(data => {
              const pins = Array.isArray(data) ? data : [];
              setPinnedLocations(pins);
              
              const userIds = new Set();
              pins.forEach(pin => {
                if (pin.author) userIds.add(pin.author);
                
                if (pin.tags && Array.isArray(pin.tags)) {
                  pin.tags.forEach(tagId => {
                    if (tagId) userIds.add(tagId);
                  });
                }
              });
              
              fetchUserDetails(Array.from(userIds), token);
            })
            .catch(error => {
              console.error('Error:', error);
              setError('Failed to load feed. Please try again later.');
            });
        }
    }, []);
    
    const fetchUserDetails = async (userIds, token) => {
        try {
            const userDetails = {};
            
            for (const userId of userIds) {
                const response = await axios.get(`http://localhost:4000/get_user/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.data) {
                    userDetails[userId] = response.data;
                }
            }
            
            setUserMap(userDetails);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    if (pinnedLocations === null) {
        return <Loading />;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="flex flex-col mx-auto p-3 h-full">
            <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto">
                {pinnedLocations.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No pins in your feed yet. Create a pin or connect with friends!
                    </div>
                ) : (
                    pinnedLocations.map((pin) => (
                        <div key={pin.id} className="mb-8">
                            <div className="flex items-center mb-3">
                                <img 
                                    src={userMap[pin.author]?.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
                                    alt={userMap[pin.author]?.username || "User"} 
                                    className="h-8 w-8 rounded-full object-cover mr-2"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-sm">
                                        {userMap[pin.author]?.username || "User"}
                                        {pin.tags && pin.tags.length > 0 && (
                                            <span className="font-normal">
                                                {pin.tags.map((tagId, index) => {
                                                    const taggedUser = userMap[tagId];
                                                    if (!taggedUser) return null;
                                                    
                                                    return (
                                                        <span key={tagId}>
                                                            {index === 0 ? ' & ' : ', '}
                                                            {taggedUser.username}
                                                        </span>
                                                    );
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">{pin.locationName}</p>
                                </div>
                                <VisibilityBadge visibility={pin.visibility} />
                            </div>
                            
                            <img 
                                src={pin.imageUrl} 
                                alt={pin.title} 
                                className="w-full max-h-96 object-cover mb-3"
                            />
                            
                            <div className="mb-2">
                                <h3 className="font-bold text-lg">{pin.title}</h3>
                                <p className="text-xs text-gray-500">{formatDate(pin.createdAt)}</p>
                            </div>
                            
                            <ExpandableDescription description={pin.description} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const VisibilityBadge = ({ visibility }) => {
    const getVisibilityInfo = () => {
        switch(visibility) {
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
    
    const visibilityInfo = getVisibilityInfo();
    
    return (
        <span className={`text-xs px-2 py-1 rounded-full ${visibilityInfo.bgColor} ${visibilityInfo.textColor}`}>
            {visibilityInfo.label}
        </span>
    );
};

const ExpandableDescription = ({ description }) => {
    const [expanded, setExpanded] = useState(false);
    
    if (!description) return null;
    
    return (
        <div>
            <p className={expanded ? "text-sm" : "text-sm line-clamp-2"}>
                {description}
            </p>
            {description.length > 80 && (
                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-500 text-xs mt-1 font-medium"
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
};

export default Feeds;