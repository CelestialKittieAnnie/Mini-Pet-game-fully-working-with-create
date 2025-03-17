"use client";
import React from "react";
import BottomNav from "../../components/bottom-nav";

function MainComponent() {
  const [traits, setTraits] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(
        localStorage.getItem("customTraits") ||
          JSON.stringify({
            species: [],
            affinities: [],
            colors: [],
            mutations: [],
            artStyles: [],
          })
      );
    }
    return {
      species: [],
      affinities: [],
      colors: [],
      mutations: [],
      artStyles: [],
    };
  });

  const [newTrait, setNewTrait] = useState({
    species: "",
    affinities: "",
    colors: "",
    mutations: "",
    artStyles: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("customTraits", JSON.stringify(traits));
    }
  }, [traits]);

  const addTrait = (category) => {
    if (!newTrait[category]) return;
    setTraits((prev) => ({
      ...prev,
      [category]: [
        ...prev[category],
        { id: Date.now(), value: newTrait[category] },
      ],
    }));
    setNewTrait((prev) => ({ ...prev, [category]: "" }));
  };

  const deleteTrait = (category, id) => {
    setTraits((prev) => ({
      ...prev,
      [category]: prev[category].filter((trait) => trait.id !== id),
    }));
  };

  const editTrait = (category, id, newValue) => {
    setTraits((prev) => ({
      ...prev,
      [category]: prev[category].map((trait) =>
        trait.id === id ? { ...trait, value: newValue } : trait
      ),
    }));
    setEditingId(null);
  };

  const renderSection = (title, category) => (
    <div className="mb-8">
      <h2 className="text-2xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-4">
        {title}
      </h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={newTrait[category]}
          onChange={(e) =>
            setNewTrait((prev) => ({ ...prev, [category]: e.target.value }))
          }
          className="w-full px-4 py-2 rounded-lg bg-[#fef6ff] dark:bg-[#2a1f2d] border-2 border-[#e6d6ff] dark:border-[#3d2f40] focus:outline-none focus:ring-2 focus:ring-[#9f6fb9] dark:focus:ring-[#d4b6e6] transition-all duration-300 hover:shadow-[0_0_10px_rgba(159,111,185,0.3)]"
          placeholder={`Add new ${category}...`}
        />
        <button
          onClick={() => addTrait(category)}
          className="px-6 py-2 bg-[#9f6fb9] dark:bg-[#d4b6e6] text-white rounded-lg hover:bg-[#8a5ea4] dark:hover:bg-[#c3a5d5] transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          ✨ Add
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {traits[category].map((trait) => (
          <div
            key={trait.id}
            className="flex items-center gap-2 p-3 rounded-lg bg-white/30 dark:bg-[#2a1f2d]/30 backdrop-blur-sm"
          >
            {editingId === trait.id ? (
              <input
                type="text"
                value={trait.value}
                onChange={(e) => editTrait(category, trait.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                autoFocus
                className="flex-1 px-2 py-1 rounded bg-[#fef6ff] dark:bg-[#2a1f2d] border border-[#e6d6ff] dark:border-[#3d2f40]"
              />
            ) : (
              <span className="flex-1 text-[#6b567c] dark:text-[#9f8aa8]">
                {trait.value}
              </span>
            )}
            <button
              onClick={() => setEditingId(trait.id)}
              className="text-[#9f6fb9] dark:text-[#d4b6e6] hover:scale-110 transition-transform"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteTrait(category, trait.id)}
              className="text-[#9f6fb9] dark:text-[#d4b6e6] hover:scale-110 transition-transform"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-8 text-center">
          ✨ Custom Traits ✨
        </h1>
        {renderSection("Magical Species", "species")}
        {renderSection("Mystical Affinities", "affinities")}
        {renderSection("Enchanted Colors", "colors")}
        {renderSection("Magical Mutations", "mutations")}
        {renderSection("Artistic Styles", "artStyles")}
      </div>
      <BottomNav activeTab="traits" />
      <style jsx global>{`
        @keyframes sparkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        input:focus {
          animation: sparkle 1.5s infinite;
        }
      `}</style>
    </PageContainer>
  );
}

export default MainComponent;