"use client";
import React from "react";
import BottomNav from "../../components/bottom-nav";

function MainComponent() {
  const [visitedPages, setVisitedPages] = useState({});

  useEffect(() => {
    const storedVisits = localStorage.getItem("visitedPages");
    if (storedVisits) {
      setVisitedPages(JSON.parse(storedVisits));
    }
  }, []);

  const handleNavigation = (path) => {
    const newVisitedPages = { ...visitedPages, [path]: true };
    localStorage.setItem("visitedPages", JSON.stringify(newVisitedPages));
    setVisitedPages(newVisitedPages);
    window.location.href = path;
  };

  const buttons = [
    {
      title: "Create Pet",
      emoji: "✨",
      path: "/create-pet",
      color: "from-[#ffcae9] to-[#c1a1ff]",
      hoverEffect: "hover:scale-105 hover:rotate-2",
    },
    {
      title: "Pet Gallery",
      emoji: "🎨",
      path: "/pet-gallery",
      color: "from-[#a1c4fd] to-[#c2e9fb]",
      hoverEffect: "hover:scale-105 hover:-rotate-2",
    },
    {
      title: "Breed Pets",
      emoji: "🌟",
      path: "/breed-pets",
      color: "from-[#fbc2eb] to-[#a6c1ee]",
      hoverEffect: "hover:scale-105 hover:rotate-1",
    },
    {
      title: "Custom Traits",
      emoji: "🦄",
      path: "/custom-traits",
      color: "from-[#84fab0] to-[#8fd3f4]",
      hoverEffect: "hover:scale-105 hover:-rotate-1",
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col items-center space-y-8 pt-8">
        <h1 className="text-4xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-8">
          Magical Pet Creator ✨
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {buttons.map((button) => (
            <button
              key={button.title}
              onClick={() => handleNavigation(button.path)}
              className={`
                p-8 rounded-2xl bg-gradient-to-r ${button.color}
                transform transition-all duration-300 ${button.hoverEffect}
                shadow-lg hover:shadow-2xl
                flex flex-col items-center justify-center
                min-h-[200px]
                backdrop-blur-sm bg-opacity-80
              `}
            >
              <span className="text-4xl mb-4">{button.emoji}</span>
              <span className="text-2xl font-crimson-text text-[#2a1f2d] dark:text-white">
                {button.title}
              </span>
              {visitedPages[button.path] && (
                <span className="mt-2 text-sm text-[#4a3657] dark:text-[#d4b6e6]">
                  Previously visited ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <BottomNav activeTab="home" />
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </PageContainer>
  );
}

export default MainComponent;