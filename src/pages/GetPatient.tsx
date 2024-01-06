import React, {useEffect, useState} from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { PatientService } from '../rest/PatientService';
import { useNavigate } from 'react-router-dom';
import { userService } from "../rest/UserService";
import "../css/index.css"


function GetPatient() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (userService.isPatient() || !userService.isLoggedIn()){
            navigate("/Home")
        }else {
            const fetchData = async () => {
                try {
                    const result = await PatientService.getAllPatients();

                    setPatients(result.response);
                } catch (error) {
                    console.error('Error fetching patient details:', error);
                }
            };
            fetchData();
        }
    }, []);

    const handleSearch = async () => {
        try {
            const result = await PatientService.searchPatient(firstName, lastName);

            if (result.ok) {
                setPatients(result.response);
            } else {
                console.log('No patients found');
            }
        } catch (error) {
            console.error('API request failed:', error);
        }
    };

    const handleRowClick = (patientId: any) => {
        navigate(`/patient/${patientId}/details`);
    };

    return (
        <Container>
            <Paper elevation={4} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Search For Patients
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        label="First Name"
                        fullWidth
                        variant="outlined"
                        style={{ marginRight: '10px' }}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        variant="outlined"
                        style={{ marginRight: '10px' }}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <Button
                        color="primary"
                        endIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </div>
            </Paper>
            <Paper elevation={4} style={{ padding: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Age</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.length > 0 ? (
                            patients.map((patient: any) => (
                                <TableRow
                                    key={patient.id}
                                    component="tr"
                                    onClick={() => handleRowClick(patient.id)}
                                    style={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                        },
                                    }}
                                >
                                    <TableCell>{patient.firstName}</TableCell>
                                    <TableCell>{patient.lastName}</TableCell>
                                    <TableCell>{patient.age}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3}>No patient data available.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default GetPatient;
