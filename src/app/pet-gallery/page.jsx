"use client";
import React from "react";
import BottomNav from "../../components/bottom-nav";

function MainComponent() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("/api/get-pets", { method: "POST" });
        if (!response.ok) throw new Error("Failed to fetch pets");
        const data = await response.json();
        setPets(data.pets || []);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError("Failed to load pets");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return (
    <PageContainer>
      <div className="mb-20">
        <h1 className="text-4xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-8 text-center">
          ✨ Magical Pet Gallery ✨
        </h1>

        {loading && (
          <div className="text-center text-[#6b567c] dark:text-[#9f8aa8] font-inter p-8">
            <div className="w-8 h-8 border-4 border-[#9f6fb9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading your magical companions...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-inter p-8">{error}</div>
        )}

        {!loading && !error && pets.length === 0 ? (
          <div className="text-center text-[#6b567c] dark:text-[#9f8aa8] font-inter p-8">
            No pets found in your gallery yet! Create some magical companions
            first.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="transform transition-all duration-300 hover:scale-105 hover:-rotate-1"
              >
                <div className="bg-white/80 dark:bg-[#3d2f40]/80 rounded-xl overflow-hidden shadow-lg border-2 border-[#e6d6ff] dark:border-[#4a3657]">
                  <div className="relative aspect-square">
                    <img
                      src={pet.generated_image}
                      alt={`${pet.name} the magical pet`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 text-2xl">
                      {pet.gender === "Male" ? "♂️" : "♀️"}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-2">
                      {pet.name}
                    </h3>

                    <div className="space-y-2">
                      <p className="text-sm font-inter text-[#6b567c] dark:text-[#9f8aa8]">
                        <span className="font-semibold">Art Style:</span>{" "}
                        {pet.art_style}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {[pet.species, pet.affinity, pet.mutation].map(
                          (trait, index) =>
                            trait && (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-inter rounded-full bg-[#f0e6ff] dark:bg-[#4a3657] text-[#4a3657] dark:text-[#d4b6e6]"
                              >
                                {trait}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav activeTab="gallery" />
      <style jsx global>{`
        @keyframes cardFloat {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-5px) rotate(1deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        .card-float {
          animation: cardFloat 3s ease-in-out infinite;
        }
      `}</style>
    </PageContainer>
  );
}

export default MainComponent;