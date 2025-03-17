"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ activeTab = "home" }) {
  const [isHovered, setIsHovered] = useState(null);

  const navItems = [
    { id: "home", label: "🏰 Home", path: "/dashboard" },
    { id: "create", label: "✨ Create Pet", path: "/create-pet" },
    { id: "gallery", label: "🎨 Gallery", path: "/pet-gallery" },
    { id: "breed", label: "🌟 Breed Pets", path: "/breed-pets" },
    { id: "traits", label: "🦄 Traits", path: "/custom-traits" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#fef6ff] dark:bg-[#2a1f2d] border-t border-[#f0e6ff] dark:border-[#3d2f40] w-full px-4 py-2 z-50">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? "text-[#9f6fb9] dark:text-[#d4b6e6]"
                    : "text-[#6b567c] dark:text-[#9f8aa8]"
                } hover:text-[#9f6fb9] dark:hover:text-[#d4b6e6]`}
                onMouseEnter={() => setIsHovered(item.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <span
                  className={`text-xl mb-1 ${
                    isHovered === item.id ? "animate-bounce" : ""
                  }`}
                >
                  {item.label.split(" ")[0]}
                </span>
                <span className="text-xs font-inter hidden md:block">
                  {item.label.split(" ").slice(1).join(" ")}
                </span>
              </a>
            ))}
          </div>
        </div>
      </nav>
      <style jsx global>{`
        @keyframes sparkle {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

function StoryComponent() {
  return (
    <div className="h-screen bg-white dark:bg-[#1a1a1a]">
      <div className="p-4">
        <h3 className="font-inter font-bold text-gray-900 dark:text-white mb-4">
          Default Navigation
        </h3>
        <MainComponent activeTab="home" />
      </div>
      <div className="p-4 mt-8">
        <h3 className="font-inter font-bold text-gray-900 dark:text-white mb-4">
          Active on Create Pet
        </h3>
        <MainComponent activeTab="create" />
      </div>
      <div className="p-4 mt-8">
        <h3 className="font-inter font-bold text-gray-900 dark:text-white mb-4">
          Active on Gallery
        </h3>
        <MainComponent activeTab="gallery" />
      </div>
    </div>
  );
});
}
