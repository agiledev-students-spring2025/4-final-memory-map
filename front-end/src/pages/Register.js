import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';  
import Button from "../components/Button";
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const validatePassword = (pass) => {
        const minLength = 6;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        
        if (pass.length < minLength) {
            return "Password must be at least 6 characters long";
        }
        if (!hasSpecialChar) {
            return "Password must contain at least one special character";
        }
        return "";
    };
    
    const handleRegister = async (event) => {
        event.preventDefault();
        setError("");
        setPasswordError("");

        if (!username || !email || !password || !confirmPassword) {
            setError("Please fill out all fields.");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (passwordValidation) {
            setPasswordError(passwordValidation);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/register', {
                username,
                email,
                password,
                confirmPassword
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate("/landing");
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.response?.data?.error || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col mx-auto p-4 h-full">
            <h2 className="text-left text-2xl font-bold text-black-500">Sign Up</h2>
            {error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form className="mt-2 w-full flex-1 overflow-y-auto" onSubmit={handleRegister}>
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
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(validatePassword(e.target.value));
                        }}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Enter a password"
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                        Password must be at least 6 characters long and contain at least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                    </p>
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