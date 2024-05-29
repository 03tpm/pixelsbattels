// src/App.tsx
import React from 'react';
import PixelGrid from './components/PixelGrid';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Pixel Paint</h1>
      <PixelGrid />
    </div>
  );
};

export default App;
