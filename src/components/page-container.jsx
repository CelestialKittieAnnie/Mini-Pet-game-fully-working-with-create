"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ children }) {
  const [sparklePosition, setSparklePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const moveSparkle = () => {
      setSparklePosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    };
    const interval = setInterval(moveSparkle, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef6ff] to-[#f0e6ff] dark:from-[#2a1f2d] dark:to-[#1a1f2d] relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute w-4 h-4 text-[#9f6fb9] dark:text-[#d4b6e6] animate-float"
          style={{
            left: `${sparklePosition.x}%`,
            top: `${sparklePosition.y}%`,
          }}
        >
          ✨
        </div>
      </div>
      <div className="relative border-4 border-[#e6d6ff] dark:border-[#3d2f40] rounded-2xl m-4 bg-white/50 dark:bg-[#2a1f2d]/50 backdrop-blur-sm">
        <div className="p-6 pb-24">{children}</div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function StoryComponent() {
  return (
    <div>
      <MainComponent>
        <h1 className="text-2xl font-inter text-[#4a3657] dark:text-[#d4b6e6] mb-4">
          Sample Content
        </h1>
        <p className="text-[#6b567c] dark:text-[#9f8aa8]">
          This is an example of content inside the magical container.
        </p>
      </MainComponent>
      <MainComponent>
        <div className="h-[500px] flex items-center justify-center text-[#6b567c] dark:text-[#9f8aa8]">
          Taller content example
        </div>
      </MainComponent>
    </div>
  );
});
}