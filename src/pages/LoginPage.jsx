import { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const LoginPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F4F6] min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-6xl">
        
        {/* Odamcha animatsiya */}
        <Player
          autoplay
          loop
          src="https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
          style={{ height: "350px", width: "350px" }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
