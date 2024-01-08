import React from 'react';
import Header from './Header';
import {Route, Routes} from "react-router-dom";
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

function App() {
    return (
            <Routes>
                    <Route path="/Home" element={<Home />}/>
            </Routes>
    );
}

export default App;
