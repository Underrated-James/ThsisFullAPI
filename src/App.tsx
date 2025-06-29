import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./Games/2048/store"; 


import { useFontSize, FontSizeProvider } from "./components/FontSizeContext";
import { ColorBlindProvider } from "./DaltonizationFilter/ColorBlindContext";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Games from "./components/Games";
import About from "./components/About";
import Settings from "./components/Settings";
import VoiceController from "./components/VoiceController";

import TritanopiaFilter from "./DaltonizationFilter/TritanopiaFilter";
import ProtanopiaFilter from "./DaltonizationFilter/ProtanopiaFilter";
import DeuteranopiaFilter from "./DaltonizationFilter/DeuteranopiaFilter";

import Game2048 from "./Games/2048/Game2048";
import FlappyBird from "./Games/Flappybird/components/Flappybird";
import Tetris from "./Games/Tetris/Tetris";

import { VoiceCommandProvider } from "./components/VoiceCommandContext";
import GlobalVoiceHandler from "./components/GlobalVoiceHandler";
import ColorFilterVoiceHandler from "./components/ColorFilterVoiceHandler";

import "./App.css";

function AppContent() {
  const fontSize = useFontSize();

  useEffect(() => {
    document.body.style.setProperty("--dynamic-font-size", `${fontSize}px`);
  }, [fontSize]);

  return (
    <>
      {/* Filters for colorblind modes */}
      <ProtanopiaFilter />
      <DeuteranopiaFilter />
      <TritanopiaFilter />

      <Header />
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />

            {/* Game Routes */}
            <Route path="/2048" element={<Game2048 />} />
            <Route path="/flappybird" element={<FlappyBird />} />
            <Route path="/tetris" element={<Tetris />} />

            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </div>
      </div>

      {/* Voice components */}
      <VoiceController />
      <GlobalVoiceHandler />
      <ColorFilterVoiceHandler />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ColorBlindProvider>
          <FontSizeProvider>
            <VoiceCommandProvider>
              <AppContent />
            </VoiceCommandProvider>
          </FontSizeProvider>
        </ColorBlindProvider>
      </Router>
    </Provider>
  );
}

export default App;
