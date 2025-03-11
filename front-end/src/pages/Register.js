import { Link } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {
    return (
        <div className="h-screen flex justify-center bg-white">
            <div className="w-full max-w-md p-5">
                <h2 className="text-left text-2xl font-bold text-black-500">Sign Up</h2>
                <form className="mt-2">
                    <div className="mb-4">
                        <label className="block text-gray-700">First Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter first name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter last name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter a username"
                        />
                    </div>

                    <div className="mb-4">
                        <label className='block text-gray-700'>Email Address</label>
                        <input 
                            type='email'
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder='Enter an email address'
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter a password"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter password to confirm"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;