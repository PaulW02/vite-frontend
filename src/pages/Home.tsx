import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { userService } from "../rest/UserService";
import { useKeycloak } from "@react-keycloak/web";

function Home() {
    const username = localStorage.getItem('username')
    const navigation = useNavigate();
    const [roleName, setSelectedRole] = useState('');

    const handleRoleChange = (event: any) => {
        setSelectedRole(event.target.value);
    };

    const handleRoleSubmit = () => {
        // Perform the action based on the selected role (e.g., make an API call to update roles)
        console.log('Selected Role:', roleName);
        try {
            const result = userService.addRole(roleName);

        } catch (error) {
            console.error('Error fetching patient details:', error);
        }
    };
    useEffect( () => {

    }, []);

    if (userService.isDoctor() || userService.isEmployee() || userService.isPatient()) {
        console.log(userService.getRoles())
        return (
            <div>
                    <h1 className="flex items-center justify-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Welcome
                        to the home page {userService.getEmail()}</h1>
            </div>
        );
    }else {
        return (
            <div>
                <div>
                    <h1 className="flex items-center justify-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Welcome to the home page
                    </h1>
                    <br/>
                    <h3 className="flex items-center justify-center">
                        Select the role you want to be
                    </h3>
                    <br/>
                    <form className="flex items-center">
                        <div className="flex items-center mb-4">
                            <input id="role_doctor" type="radio" checked={roleName === 'role_doctor'}
                                   onChange={handleRoleChange} value="role_doctor" name="doctor" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="role_doctor" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Doctor</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input id="role_employee" type="radio" checked={roleName === 'role_employee'}
                                   onChange={handleRoleChange} value="role_employee" name="employee" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="role_employee" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Employee</label>
                        </div>
                        <div className="flex items-center mb-4">
                            <input id="role_patient" type="radio" checked={roleName === 'role_patient'}
                                   onChange={handleRoleChange} value="role_patient" name="patient" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="role_patient" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Patient</label>
                        </div>

                        <button type="button" onClick={handleRoleSubmit}  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Home;
