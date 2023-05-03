import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Login/>} />
                    <Route exact path="/register" element={<Register/>} />
                    <Route exact path="/home" element={<Home/>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;