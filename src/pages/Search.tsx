import React, { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import '../css/index.css';
import {SearchService} from "../rest/SearchService"
import { userService } from "../rest/UserService";
function Search() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        if (userService.isPatient() || !userService.isLoggedIn()){
            navigate("/Home")
        } else {
            // Fetch initial patient data or perform any initial actions here
        }
    }, [role, navigate]); // Added dependencies for useEffect

    const handleSearch = async () => {
        try {
            const result = await SearchService.searchPatient(firstName, firstName, firstName);

            if (result.ok) {
                console.log(result.response);
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
                    <Button color="primary" endIcon={<SearchIcon />} onClick={handleSearch}>
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

export default Search;
