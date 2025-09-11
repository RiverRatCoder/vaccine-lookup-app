import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import VaccineDetailsPage from './pages/VaccineDetailsPage';
import AboutPage from './pages/AboutPage';
import { VaccineProvider } from './context/VaccineContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <VaccineProvider>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vaccine/:id" element={<VaccineDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </VaccineProvider>
  );
}

export default App;

