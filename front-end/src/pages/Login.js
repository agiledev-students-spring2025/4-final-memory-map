import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from "../components/Button";
import Image from "../components/MockImage";
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        if (!username || !password) {
            alert("Please enter an username and password.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/profile/login`, {
                username,
                password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate("/landing");
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.error || "Login failed. Please try again.");
        }
    };

    return (
        <div className="h-screen flex justify-center bg-white">
            <div className="w-full max-w-md p-5">
                <div className="flex justify-center mb-4">
                    <Image width={300} height={300}/>
                </div>
                
                <h2 className="text-left text-2xl font-bold text-black-500">Login</h2>
                {error && (
                    <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                <form className="mt-2" onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter password"
                        />
                    </div>
                    
                    <p className="mt-4 text-left text-sm pb-4">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-gray-500 hover:underline">Register</Link>
                    </p>

                    <Button onClick={handleLogin}>Login</Button>
                </form>
            </div>
        </div>
    )
}

export default Login; 