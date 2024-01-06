import React, { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { userService } from "../rest/UserService";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import "../css/index.css";
import jsonFile from "../keycloak.json"

function Login() {
    const [keycloak, setKeycloak] = useState<Keycloak.KeycloakInstance | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        const initKeycloak = async () => {
            const keycloakInstance = new Keycloak(jsonFile);
            try {
                await keycloakInstance.init({
                    onLoad: 'login-required',
                    // Add other Keycloak initialization options here
                });
                setKeycloak(keycloakInstance);
                setAuthenticated(true);
            } catch (error) {
                console.error('Keycloak initialization error', error);
            }
        };

        initKeycloak();
    }, []);

    const handleInputChange = (e: any) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();

        if (!keycloak) {
            console.error('Keycloak not initialized');
            return;
        }
        await keycloak.init({
            checkLoginIframe: false, // or true depending on your use case
            checkLoginIframeInterval: 0, // or adjust the interval
            // ... other options
        });

        const loginOptions: Keycloak.KeycloakLoginOptions = {
            loginHint: formData.username, // Use username as the login hint
            // Add other relevant properties if needed
        };
        try {

            await keycloak.login(loginOptions);

            const userProfile = await keycloak.loadUserProfile();
            if (userProfile != null) {

                localStorage.setItem('userId', userProfile.id != null ? userProfile.id : "");
                localStorage.setItem('userId', userProfile.username != null ? userProfile.username : "TEST");
                //localStorage.setItem('username', userProfile.email);
                //localStorage.setItem('role', userProfile.role);
                navigate("/Home");
            }
        } catch (error) {
            console.error('Login failed', error);
            // Handle login failure (e.g., show an error message)
        }
    };


    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in
                        to your account</h2>
                </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onClick={handleLogin} method="POST">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Email
                            address</label>
                        <div className="mt-2">
                            <input id="username" name="username" value={formData.username} onChange={handleInputChange}
                                   required
                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password"
                                   className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        </div>
                        <div className="mt-2">
                            <input id="password" type="password" name="password"  value={formData.password} required  onChange={handleInputChange}
                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                            in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
