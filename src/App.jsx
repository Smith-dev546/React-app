import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Register from './views/session/components/Register';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <h1>Holiwis</h1>
    </Router>
  );
};

export default App;