import {Link, Route, Routes, BrowserRouter as Router} from 'react-router-dom'
import { useEffect, useState } from 'react';
import './App.css';
import UserAdmin from './pages/UserAdmin';
import VehicleStatus from './pages/VehicleStatus';
import storage from './libs/storage';
import Login from './pages/Login'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/admin' element={<UserAdmin/>}></Route>
          <Route path='/vehicle' element={<VehicleStatus/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
