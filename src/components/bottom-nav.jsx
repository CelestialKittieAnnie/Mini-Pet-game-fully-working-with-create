"use client";
import React from "react";

function MainComponent({ activeTab = "home" }) {
  const [isHovered, setIsHovered] = useState(null);

  const navItems = [
    { id: "home", label: "🏰 Home", path: "/dashboard" },
    { id: "create", label: "✨ Create Pet", path: "/create-pet" },
    { id: "gallery", label: "🎨 Gallery", path: "/pet-gallery" },
    { id: "breed", label: "🌟 Breed Pets", path: "/breed-pets" },
    { id: "traits", label: "🦄 Traits", path: "/custom-traits" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#fef6ff] dark:bg-[#2a1f2d] border-t border-[#f0e6ff] dark:border-[#3d2f40] w-full px-4 py-2 z-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <></>
          ))}
        </div>
      </div>
    </nav>
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
      <div className="p-4 mt-8">
        <h3 className="font-inter font-bold text-gray-900 dark:text-white mb-4">
          Active on Breed
        </h3>
        <MainComponent activeTab="breed" />
      </div>
      <div className="p-4 mt-8">
        <h3 className="font-inter font-bold text-gray-900 dark:text-white mb-4">
          Active on Traits
        </h3>
        <MainComponent activeTab="traits" />
      </div>
    </div>
  );
}

export default MainComponent;
