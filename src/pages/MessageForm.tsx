import React, { useState, useEffect } from 'react';
import { PatientService } from "../rest/PatientService";
import { userService } from "../rest/UserService";
import '../css/MessageForm.css';
import {MessageService} from "../rest/MessageService";
import {useNavigate} from "react-router-dom"; // Import your custom CSS file

function MessageForm() {
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState(''); // Store the selected recipient
    const userRole = localStorage.getItem('role');
    const [recipients, setRecipients] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userService.isLoggedIn()){
            navigate("/Home")
        }else {
            const fetchRecipients = async () => {
                if (userService.isPatient()) {
                    try {
                        const [doctors, employees] = await Promise.all([
                            userService.getAllDoctors(),
                            userService.getAllEmployees()
                        ]);

                        if (doctors.ok && employees.ok) {
                            const availableRecipients = [...doctors.response, ...employees.response];
                            setRecipients(availableRecipients);
                            if (availableRecipients.length > 0) {
                                setRecipient(availableRecipients[0].id); // Set the default recipient
                            }
                        } else {
                            console.log('No doctors or employees found');
                        }
                    } catch (error) {
                        console.error('API request failed:', error);
                    }
                } else if (userService.isDoctor()) {
                    try {
                        const [patients, employees, otherDoctors] = await Promise.all([
                            userService.getAllPatients(),
                            userService.getAllEmployees(),
                            userService.getAllDoctors()
                        ]);

                        if (patients.ok && employees.ok && otherDoctors.ok) {
                            const availableRecipients = [...patients.response, ...employees.response, ...otherDoctors.response];
                            setRecipients(availableRecipients);
                            if (availableRecipients.length > 0) {
                                setRecipient(availableRecipients[0].id); // Set the default recipient
                            }
                        } else {
                            console.log('No patients, employees, or other doctors found');
                        }
                    } catch (error) {
                        console.error('API request failed:', error);
                    }
                } else if (userService.isEmployee()) {
                    try {
                        const [patients, doctors, otherEmployees] = await Promise.all([
                            userService.getAllPatients(),
                            userService.getAllDoctors(),
                            userService.getAllEmployees()
                        ]);

                        if (patients.ok && doctors.ok && otherEmployees.ok) {
                            const availableRecipients = [...patients.response, ...doctors.response, ...otherEmployees.response];
                            setRecipients(availableRecipients);
                            if (availableRecipients.length > 0) {
                                setRecipient(availableRecipients[0].id); // Set the default recipient
                            }
                        } else {
                            console.log('No patients, doctors, or other employees found');
                        }
                    } catch (error) {
                        console.error('API request failed:', error);
                    }
                }
            };
            fetchRecipients();
        }

    }, []);

    const handleAddMessage = () => {
        // Get the current date and time
        const currentDate = new Date();
        const isoDate = currentDate.toISOString();

        // Assuming you have the sender's user ID available
        const senderUserId = userService.getSub();

        // Here, you can create a message object with the relevant information
        const messageObject = {
            info: message,
            senderId: senderUserId,
            receiverId: recipient, // Use the selected recipient
        };

        // Log the message object or send it to your backend for storage
        MessageService.sendMessage(messageObject).then(r => {
            if (r.ok){
                console.log("Message sent")
            }
        });
        console.log('Message Object:', messageObject);

        // Reset the message input
        setMessage('');
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form className="max-w-md w-full mx-auto">
                <div className="mb-6">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your message
                    </label>
                    <input
                        type="text"
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Enter your message"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="recipient" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Select recipient
                    </label>
                    <select
                        id="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    >
                        {recipients.map((recipient) => (
                            <option key={recipient.id} value={recipient.id}>
                                {recipient.email}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleAddMessage}
                >
                    Send Message
                </button>
            </form>
        </div>
    );
}

export default MessageForm;
