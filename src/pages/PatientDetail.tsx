import React, {useEffect, useRef, useState} from 'react';
import { PatientService } from '../rest/PatientService';
import axios, { AxiosResponse } from 'axios';
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



const PatientDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [encounters, setEncounters] = useState<any>(null);
    const [observations, setObservations] = useState<any>(null);
    const [selectedObservation, setSelectedObservation] = useState<any>(null);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const [file, setFile] = useState<File | null>(null); // Specify the type for file
    const [images, setImages] = useState<any[]>([]); // Specify the type for images
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null); // Specify the type for selectedImageIndex
    const canvasRef = useRef<HTMLCanvasElement>(null); // Specify the type for canvasRef
    const contextRef = useRef<CanvasRenderingContext2D | null>(null); // Specify the type for contextRef
    const [isDrawing, setIsDrawing] = useState<boolean>(false); // Specify the type for isDrawing

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    }
    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
    };

    const setToDraw = () => {
        const ctx = contextRef.current;
        if (ctx) {
            ctx.globalCompositeOperation = 'source-over';
        }
    };

    const setToErase = () => {
        const ctx = contextRef.current;
        if (ctx) {
            ctx.globalCompositeOperation = 'destination-out';
        }
    };
    const handleUploadId= async (encounterID: number) =>{
        if (!file || !encounterID) {
            console.error('Please select a file and enter an encounter ID.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            await axios.post(`https://api-gateway.app.cloud.cbh.kth.se/image/upload/${encounterID}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh images associated with the encounterID after upload
            const response = await axios.get(`https://api-gateway.app.cloud.cbh.kth.se/image/images/${encounterID}`);
            // Assuming response.data is an array of images with imageData field
            setImages(response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
    const fetchImagesId = async (encounterID: number) => {
        try {
            const response: AxiosResponse<ImageData[]> = await axios.get(`https://api-gateway.app.cloud.cbh.kth.se/image/images/${encounterID}`);
            setImages(response.data); // Assuming response.data is an array of images with imageData field
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    async function fetchImages() {
        try {
            const response = await axios.get('https://api-gateway.app.cloud.cbh.kth.se/image/images');
            setImages(response.data); // Assuming response.data is an array of images with imageData field
        } catch (error) {
            console.error(error);
        }
    }
    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        try {
            await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const response = await axios.get('http://localhost:3000/image/images');
            setImages(response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    const saveDrawing = async(encounterID: number) => {
        const canvas = canvasRef.current;
        if (!canvas || selectedImageIndex === null || !images[selectedImageIndex]?.id) return;

        const base64Image = new Image();
        base64Image.src = `data:image/png;base64,${images[selectedImageIndex].imageData}`;

        base64Image.onload = async function () {
            const newCanvas = document.createElement('canvas');
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height;
            const context = newCanvas.getContext('2d');

            if (context) { // Check if context is not null
                context.drawImage(base64Image, 0, 0, newCanvas.width, newCanvas.height);
                context.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

                const base64Data = newCanvas.toDataURL('image/jpeg').split(',')[1]; // Get merged base64 data

                try {
                    await axios.post(`https://api-gateway.app.cloud.cbh.kth.se/image/update-image/${images[selectedImageIndex].id}`, {
                        image: base64Data,
                    });
                    fetchImagesId(encounterID)

                } catch (error) {
                    console.error('Error updating image:', error);
                }
            }
        };
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {

        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const mouseEvent = event.nativeEvent as MouseEvent;
                const { offsetX, offsetY } = mouseEvent;
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY);
                setIsDrawing(true);
            }
        }

    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas) {
            const mouseEvent = event.nativeEvent as MouseEvent;
            const { offsetX, offsetY } = mouseEvent;
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }
    };


    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.closePath();
            }
        }
    };


    useEffect(() => {
        if (selectedImageIndex !== null && images.length > 0) {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = 400;
                canvas.height = 400;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.lineWidth = 5;
                    contextRef.current = ctx;
                }
            }
        }
    }, [selectedImageIndex, images]);

    useEffect(() => {
        if (userService.isPatient() || !userService.isLoggedIn()){
            navigate("/Home")
        }else {
            const fetchData = async () => {
                try {
                    if (id != null) {
                        const result = await PatientService.getPatientDetails(parseInt(id));
                        setPatientDetails(result.response);
                        setEncounters(result.response.encounters);
                    }
                } catch (error) {
                    console.error('Error fetching patient details:', error);
                }
            };
            fetchData();
        }
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
        return <p>Loading...</p>;
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
    function renderImagesSection(title: any,encounterID: number) {
        return (
            images
            && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-images-content`} id={`panel-images-header`}>
                        <Typography variant="h6">{title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                        <button onClick={()=>handleUploadId(encounterID)}>Upload Image</button>
                        <br/>
                        <br/>
                        <button onClick={()=>fetchImagesId(encounterID)}>Get Images</button>
                        <div className="image-container">
                            {images.map((image:any, index:number) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={`data:image/png;base64,${image.imageData}`}
                                        alt={`Image ${index}`}
                                        style={{
                                            width: '400px',
                                            height: '400px',
                                            border: selectedImageIndex === index ? '2px solid red' : 'none',
                                        }}
                                        onClick={() => handleImageClick(index)}
                                    />
                                    {selectedImageIndex === index && (
                                        <canvas
                                            ref={canvasRef}
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseOut={stopDrawing}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                pointerEvents: 'auto', // Allow canvas interaction
                                                width: '400px',
                                                height: '400px',
                                                border: '2px solid red'
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div>
                            <button onClick={setToDraw}>Draw</button>
                            <br/>
                            <br/>
                            <button onClick={setToErase}>Erase</button>
                            <br/>
                            <br/>
                            <button onClick={()=>saveDrawing(encounterID)}>Save</button>
                        </div>
                    </AccordionDetails>
                </Accordion>
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
                            {renderImagesSection('Images',encounter.id)}
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

export default PatientDetails;