import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useColorBlind, ColorBlindProvider } from "./DaltonizationFilter/ColorBlindContext"; 
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Games from "./components/Games";
import About from "./components/About";
import Settings from "./components/Settings";
import VoiceController from "./components/VoiceController";
import TritanopiaFilter from "./DaltonizationFilter/TritanopiaFilter";
import ProtanopiaFilter from "./DaltonizationFilter/ProtanopiaFilter";
import "./App.css";

function AppContent() {
  const { filter } = useColorBlind(); // ✅ Now safely inside ColorBlindProvider

  return (
    <>
      {/* ✅ Apply the selected colorblind filter */}
      {filter === "protanopia" && <ProtanopiaFilter />}
      {filter === "tritanopia" && <TritanopiaFilter />}

      {/* ✅ Router wraps everything */}
      <Header />
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>

      <VoiceController />
    </>
  );
}

function App() {
  return (
    <Router>
      <ColorBlindProvider>
        <AppContent />
      </ColorBlindProvider>
    </Router>
  );
}

export default App;
