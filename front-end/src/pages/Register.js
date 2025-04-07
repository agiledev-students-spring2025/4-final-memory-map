import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';  
import Button from "../components/Button";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    
    const handleRegister = async (event) => {
        event.preventDefault();

        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            alert("Please fill out all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!isChecked) {
            alert("You must agree to the Terms of Service.");
            return;
        }

        const newUser = {
            user_id: 55,
            username,
            first_name: firstName,
            last_name: lastName,
            email,
            gender: "",        
            birthdate: "", 
            password
        };

        try {
            const response = await fetch('http://localhost:4000/create_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("User created", data);
                navigate("/landing");
            } else {
                alert("Failed to create user. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="flex flex-col mx-auto p-4 h-full">
            <h2 className="text-left text-2xl font-bold text-black-500">Sign Up</h2>
            <form className="mt-2 w-full flex-1 overflow-y-auto" onSubmit={handleRegister}>
                <div className="mb-4">
                    <label className="block text-gray-700">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter first name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter last name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter a username"
                    />
                </div>

                <div className="mb-4">
                    <label className='block text-gray-700'>Email Address</label>
                    <input 
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder='Enter an email address'
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter a password"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter password to confirm"
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                        className="w-4 h-4 text-gray-500 border-gray-300 rounded focus:ring-gray-400 accent-gray-500"
                    />
                    <label htmlFor="terms" className="ml-2 text-gray-700 text-sm">
                        I agree to the{" "}
                        <Link to="/terms" className="text-gray-500 hover:underline">Terms of Service</Link>
                    </label>
                </div>

                <Button type="submit">Register</Button>

                <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-gray-500 hover:underline">Log In</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;