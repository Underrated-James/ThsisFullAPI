import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ColorBlindProvider } from './DaltonizationFilter/ColorBlindContext.tsx';
import FilterManager from './DaltonizationFilter/FilterManager.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorBlindProvider>
      <FilterManager />
      <App />
    </ColorBlindProvider>
  </StrictMode>
);
