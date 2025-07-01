import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ColorBlindProvider } from './DaltonizationFilter/ColorBlindContext';
import FilterManager from './DaltonizationFilter/FilterManager';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorBlindProvider>
      <FilterManager />
      <App />
    </ColorBlindProvider>
  </StrictMode>
);
