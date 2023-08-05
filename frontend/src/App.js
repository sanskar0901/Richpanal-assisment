import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import PlanTable from './Components/PlanTable';
// import Dashboard from './Components/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Use ProtectedRoute for the dashboard */}
          <ProtectedRoute path="/dashboard" element={<PlanTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
