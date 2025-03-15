import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar"; 
import Home from "./components/Home";
import Games from "./components/Games";  // ✅ Changed from Features to Games
import About from "./components/About";
import Contact from "./components/Contact";
import VoiceController from "./components/VoiceController";

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Sidebar /> 
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />  {/* ✅ Route now properly linked */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
      <VoiceController /> {/* Ensure it is inside Router but outside Routes */}
    </Router>
  );
}

export default App;
