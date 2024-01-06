import React, {useEffect, useState} from 'react';
import { userService } from '../rest/UserService';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const history = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: 0,
        roles: '',
    });

    const username = localStorage.getItem('username')
    useEffect( () => {
        if (username != null){
            history("/Home")
        }
    }, []);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        userService.registerUser(formData).then((response) => {
            if (response.ok) {
                console.log('Successful');
                history('/Home');
            } else {
                history('/Signup');
            }
        });
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register an account</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">Age:</label>
                        <input
                            type="number"
                            name="age"
                            id="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="roles" className="block text-sm font-medium leading-6 text-gray-900">Role:</label>
                        <select
                            id="roles"
                            value={formData.roles}
                            name="roles"
                            onChange={handleInputChange}
                            required
                            className="mt-1 p-2 w-full border rounded-md"
                        >
                            <option value="">Select Role</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Patient">Patient</option>
                            <option value="Worker">Worker</option>
                        </select>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
