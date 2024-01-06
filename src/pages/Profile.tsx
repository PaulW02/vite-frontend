import React, { useEffect, useState } from 'react';
import { PatientService } from '../rest/PatientService';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "../css/index.css"
import { userService } from "../rest/UserService";


const Profile = () => {
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [encounters, setEncounters] = useState<any>(null);
    const [observations, setObservations] = useState<any>(null);
    const [selectedObservation, setSelectedObservation] = useState<any>(null);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!userService.isLoggedIn()){
            navigate("/Home")
        }
        const fetchData = async () => {
            try {
                if (userService.getSub() != null) {
                    const result = await PatientService.getPatientInfoById();
                    setPatientDetails(result.response);
                    console.log(patientDetails);
                    setEncounters(result.response.encounters);
                }
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };
        fetchData();
    }, []);

    const handleEncounterClick = async (encounter: any) => {
        try {
            const observationsResult = await PatientService.getObservationsByEncounter(encounter.id);
            setObservations(observationsResult.response);
        } catch (error) {
            console.error('Error fetching observations for encounter:', error);
        }
    };

    const handleObservationClick = (observation: any) => {
        setSelectedObservation(observation);
    };

    if (!patientDetails) {
        return <p>Loading..</p>;
    }

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8 relative">
            <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                <div className=""></div>
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {`${patientDetails.firstName} ${patientDetails.lastName}'s Details`}
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">Age: {patientDetails.age}</p>
            </div>

            {renderDetailsSection('Conditions', patientDetails.conditions)}
            {renderEncountersSection('Encounters', encounters, handleEncounterClick)}
            {selectedObservation && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h2 className="text-2xl font-bold mb-2">Selected Observation</h2>
                    <table className="table-auto w-full">
                        <thead>
                        <tr>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border px-4 py-2">{selectedObservation.type}</td>
                            <td className="border px-4 py-2">{selectedObservation.value}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    function renderDetailsSection(title: any, data: any, onClick?: any) {
        return (
            data &&
            data.length > 0 && (
                <div>
                    <Typography variant="h5" gutterBottom>
                        {title}
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                {title === 'Observations' && <TableCell>Type</TableCell>}
                                {title === 'Observations' && <TableCell>Value</TableCell>}
                                {title === 'Encounters' && <TableCell>Visit Date</TableCell>}
                                {title === 'Encounters' && <TableCell>Details</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item: any, index: any) => (
                                <TableRow key={index} onClick={() => onClick && onClick(item)}>
                                    <TableCell>{item.id}</TableCell>
                                    {title === 'Conditions' && <TableCell>{item.conditionName}</TableCell>}
                                    {title === 'Observations' && <TableCell>{item.type}</TableCell>}
                                    {title === 'Observations' && <TableCell>{item.value}</TableCell>}
                                    {title === 'Encounters' && <TableCell>{item.visitDate}</TableCell>}
                                    {title === 'Encounters' && <TableCell>{item.encounterDetails}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )
        );
    }

    function renderEncountersSection(title: any, data: any, onClick?: any) {
        return (
            data &&
            data.length > 0 && (
                <div>
                    <Typography variant="h5" gutterBottom>
                        {title}
                    </Typography>
                    {data.map((encounter: any, index: any) => (
                        <Accordion key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                onClick={() => onClick && onClick(encounter)}
                                aria-controls={`panel-${index}-content`}
                                id={`panel-${index}-header`}
                            >
                                <Typography variant="h6">{encounter.visitDate}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Details</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{encounter.id}</TableCell>
                                            <TableCell>{encounter.encounterDetails}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                            {renderObservationsSection('Observations', observations, handleObservationClick)}
                        </Accordion>
                    ))}
                </div>
            )
        );
    }

    function renderObservationsSection(title: any, data: any, onClick?: any) {
        return (
            data &&
            data.length > 0 && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-observations-content`} id={`panel-observations-header`}>
                        <Typography variant="h6">{title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((observation: any, index: any) => (
                                    <TableRow key={index} onClick={() => onClick && onClick(observation)}>
                                        <TableCell>{observation.type}</TableCell>
                                        <TableCell>{observation.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            )
        );
    }
};

export default Profile;
