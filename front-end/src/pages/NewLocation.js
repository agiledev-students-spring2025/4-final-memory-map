import React from "react";

const NewLocation = () => {
    // const myForm = 
    const [pin, setPin] = useState(null);

    useEffect(() => {
        post('https://my.api.mockaroo.com/location.json', {
            headers: {
            'X-API-Key': process.env.REACT_APP_MOCKAROO_KEY
            }
        })
    })
    return (
        <div>New Location</div>
    )
}

export default NewLocation;