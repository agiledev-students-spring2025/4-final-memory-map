import { Link } from 'react-router-dom';
import { useState } from 'react';  
import Button from "../components/Button";

const Register = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleRegister = () => {
        if (!isChecked) {
          alert("You must agree to the Terms and Conditions.");
          return;
        }
        console.log("Register button clicked"); 
      };
    
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
                            <Link to="/terms" className="text-gray-500 hover:underline">Terms and Conditions</Link>
                        </label>
                    </div>

                    <Button onClick={handleRegister}>Register</Button>

                    <p className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-gray-500 hover:underline">Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register;