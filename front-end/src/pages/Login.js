const Login = () => {
    return (
        <div className="h-screen flex justify-center bg-white">
            <div className="w-full max-w-md p-5">
                <h2 className="text-left text-2xl font-bold text-black-500">Login</h2>
                <form className="mt-2">
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Enter password"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login; 