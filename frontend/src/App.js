import {Link, Route, Routes, BrowserRouter as Router} from 'react-router-dom'
import './App.css';
import UserAdmin from './pages/UserAdmin';
import VehicleStatus from './pages/VehicleStatus';

function App() {
  return (
    <div className="App">
      <Router>
        <Link to='/'>Admin</Link>
        <Link to='/vehicle'>vehicle</Link>
        <Routes>
          <Route path='/' element={<UserAdmin/>}></Route>
          <Route path='/vehicle' element={<VehicleStatus/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
