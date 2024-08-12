// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobPostForm from './components/JobPostForm';
import AdminDashboard from './components/AdminDashboard';
import styled from 'styled-components';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Title>Recruiter Portal</Title>
        <Routes>
          <Route exact path="/" element={<JobPostForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
