import React, { useState, useEffect } from 'react';
import { Button, TextField, Autocomplete } from "@mui/material";
import '../css/AddNote.css';
import { PatientService } from "../rest/PatientService";
import { userService } from "../rest/UserService";
import {useNavigate} from "react-router-dom";

function CreatePatientNote() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] : any = useState(null);
    const [note, setNote] = useState('');
    const [observationType, setObservationType] = useState('');
    const [observationValue, setObservationValue] = useState('');
    const [patientCondition, setPatientCondition] = useState('');
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (userService.isPatient() || !userService.isLoggedIn()){
            navigate("/Home")
        }else {
            PatientService.getAllPatients().then(r => {
                if (r.ok) {
                    setPatients(r.response);
                }
            });
        }
    }, []);

    const handleAddNote = async () => {
        if (selectedPatient) {
            console.log('Adding note for patient:', selectedPatient);
            console.log('Note:', note);

            if ((observationType && observationValue) || patientCondition) {
                const data = {patientId: parseInt(selectedPatient.id)}
                PatientService.addEncounter(data).then( r => {
                    if (r.ok){
                        console.log("Successful");
                        if (observationType && observationValue) {
                            console.log('Observation Type:', observationType);
                            console.log('Observation Value:', observationValue);
                            const data = {
                                type: observationType,
                                value: parseInt(observationValue),
                                patientId: parseInt(selectedPatient.id),
                                encounterId: r.response.id
                            };
                            PatientService.addObservation(data).then(r => {
                                if (r.ok) {
                                    console.log("Successful");
                                }
                            })
                        }

                        if (patientCondition) {
                            const data = {condition: patientCondition, patientId: parseInt(selectedPatient.id)};
                            console.log('Patient Condition:', patientCondition);
                            PatientService.addCondition(data).then(r => {
                                if (r.ok) {
                                    console.log("Successful");
                                }
                            })
                        }
                    }
                });


            }
        } else {
            console.warn('Please select a patient before adding a note.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">

            <form className="max-w-md w-full mx-auto">
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Create a note</h1>
                <br/>
                <div className="mb-6">
                    <label htmlFor="patient" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Select patient
                    </label>
                    <Autocomplete
                        options={patients}
                        getOptionLabel={(patient: any) => `${patient.firstName} ${patient.lastName}`}
                        fullWidth
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        onChange={(event, newValue) => setSelectedPatient(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Välj patient" variant="outlined" />
                        )}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="observationType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Observation Type
                    </label>
                    <input
                        type="text"
                        id="observationType"
                        value={observationType}
                        onChange={(e) => setObservationType(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="observationValue" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Observation Value
                    </label>
                    <input
                        type="text"
                        id="observationValue"
                        value={observationValue}
                        onChange={(e) => setObservationValue(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="patientCondition" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Patient Condition
                    </label>
                    <input
                        type="text"
                        id="patientCondition"
                        value={patientCondition}
                        onChange={(e) => setPatientCondition(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    />
                </div>
                <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleAddNote}
                >
                    Add Note
                </button>
            </form>
        </div>
    );
}

export default CreatePatientNote;
