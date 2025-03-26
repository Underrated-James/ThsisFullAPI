import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#03122F] text-white p-6">
      {/* Title & Introduction */}
      <h1 className="text-4xl font-bold text-[#F3DADF] mb-4 text-center">
        Voice-Controlled Accessibility for Colorblind Users
      </h1>
      <p className="text-lg text-gray-300 text-center max-w-2xl">
        This project enhances gaming accessibility by integrating customizable 
        colorblind-friendly settings and voice command controls.
      </p>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <FeatureCard
          title="🎨 Colorblind Mode"
          description="Adjust game colors for better visibility."
        />
        <FeatureCard
          title="🗣️ Voice Commands"
          description="Navigate and interact using your voice."
        />
        <FeatureCard
          title="⚙️ Customizable UI"
          description="Modify contrast, colors, and highlights."
        />
      </div>

      {/* Start Game Button */}
      <button
        className="mt-8 px-6 py-3 text-lg font-semibold bg-[#F1916D] rounded-lg shadow-lg hover:bg-[#AE7DAC] transition"
        onClick={() => navigate("/Games")}
      >
        🎮 Open Games
      </button>

      {/* Instructions */}
      <div className="mt-12 text-center max-w-xl">
        <h2 className="text-2xl font-semibold text-[#F3DADF]">How to Use</h2>
        <p className="text-gray-300 mt-2">
          Say <span className="font-bold text-[#F1916D]">"Enable Colorblind Mode"</span> to adjust colors. <br />
          Say <span className="font-bold text-[#F1916D]">"Increase Contrast"</span> for better visibility.
        </p>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-[#19305C] p-6 rounded-xl shadow-lg text-center">
    <h3 className="text-xl font-bold text-[#F3DADF]">{title}</h3>
    <p className="text-gray-300 mt-2">{description}</p>
  </div>
);

export default Home;
