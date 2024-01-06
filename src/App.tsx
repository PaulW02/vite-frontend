import React from 'react';
import Header from './Header';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AddNote from "./pages/AddNote";
import GetPatient from "./pages/GetPatient";
import MessageForm from "./pages/MessageForm";
import MessageList from "./pages/MessageList";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PatientDetails from "./pages/PatientDetail";
import Search from "./pages/Search";
//import { ReactKeycloakProvider } from "@react-keycloak/web";
//import keycloak from "./keycloak"

function App() {
    return (
        //<ReactKeycloakProvider authClient={keycloak}>
        <BrowserRouter>
            <Header/>
            <Routes>
                    <Route path="/Home" element={<Home />}/>
                    <Route path="/Profile" element={<Profile />}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/AddNote" element={<AddNote/> } />
                    <Route path="/GetPatient" element={<GetPatient/>}/>
                    <Route path="/MessageForm" element={<MessageForm/> } />
                    <Route path="/Messages" element={<MessageList/> } />
                    <Route path="/patient/:id/details" element={<PatientDetails/> } />
                    <Route path="/search" element={<Search/> } />

            </Routes>
        </BrowserRouter>
        //</ReactKeycloakProvider>
    );
}

export default App;
