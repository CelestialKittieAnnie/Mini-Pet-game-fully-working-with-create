"use client";
import React from "react";
import BottomNav from "../../components/bottom-nav";

function MainComponent() {
  const [savedPets, setSavedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPets, setSelectedPets] = useState({ pet1: null, pet2: null });
  const [error, setError] = useState(null);
  const [breedingInProgress, setBreedingInProgress] = useState(false);
  const [offspring, setOffspring] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("/api/get-pets", { method: "POST" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.pets)) {
          throw new Error("Invalid pet data received");
        }
        setSavedPets(data.pets || []);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setError("Failed to load your pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const selectPetForBreeding = (pet, position) => {
    if (pet.id === selectedPets[position === "pet1" ? "pet2" : "pet1"]?.id) {
      return;
    }
    setSelectedPets((prev) => ({
      ...prev,
      [position]: pet,
    }));
    setOffspring(null);
  };

  const canBreed =
    selectedPets.pet1 &&
    selectedPets.pet2 &&
    selectedPets.pet1.id !== selectedPets.pet2.id &&
    selectedPets.pet1.gender !== selectedPets.pet2.gender;

  const breedPets = async () => {
    if (!canBreed) return;

    setBreedingInProgress(true);
    setError(null);

    try {
      const response = await fetch("/api/breed-pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pet1: selectedPets.pet1,
          pet2: selectedPets.pet2,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to breed pets");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to breed pets");
      }

      setOffspring(data.offspring);
      setSavedPets([...savedPets, data.offspring]);
    } catch (err) {
      console.error("Error breeding pets:", err);
      setError(
        err.message || "Something went wrong while breeding. Please try again."
      );
    } finally {
      setBreedingInProgress(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-8 text-center">
          ✨ Breed Your Magical Pets ✨
        </h1>

        {loading ? (
          <div className="text-center text-[#4a3657] dark:text-[#d4b6e6]">
            <div className="w-8 h-8 border-4 border-[#9f6fb9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading your pets...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {offspring && (
              <div className="mb-8 bg-white/10 dark:bg-[#3d2f40]/50 rounded-lg p-6">
                <h2 className="text-2xl font-crimson-text text-center text-[#4a3657] dark:text-[#d4b6e6] mb-4">
                  ✨ New Magical Pet Born ✨
                </h2>
                <div className="max-w-md mx-auto">
                  <img
                    src={offspring.generated_image}
                    alt={offspring.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-[#4a3657] dark:text-[#d4b6e6]">
                    {offspring.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-[#6b567c] dark:text-[#9f8aa8]">
                    <div>
                      <p>
                        <strong>Gender:</strong> {offspring.gender}
                      </p>
                      <p>
                        <strong>Species:</strong> {offspring.species.join(", ")}
                      </p>
                      <p>
                        <strong>Color:</strong> {offspring.color.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Affinity:</strong>{" "}
                        {offspring.affinity.join(", ")}
                      </p>
                      <p>
                        <strong>Mutation:</strong>{" "}
                        {offspring.mutation.join(", ")}
                      </p>
                      <p>
                        <strong>Art Style:</strong> {offspring.art_style}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="border-2 border-[#9f6fb9] dark:border-[#d4b6e6] rounded-lg p-4">
                <h2 className="text-2xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-4">
                  Select Parent 1
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {savedPets.map((pet) => (
                    <div
                      key={`pet1-${pet.id}`}
                      onClick={() => selectPetForBreeding(pet, "pet1")}
                      className={`cursor-pointer rounded-lg p-2 transition-all ${
                        selectedPets.pet1?.id === pet.id
                          ? "bg-[#9f6fb9] dark:bg-[#d4b6e6] text-white"
                          : "bg-white/50 dark:bg-[#2a1f2d]/50 hover:bg-[#9f6fb9]/20"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={pet.generated_image}
                          alt={pet.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <span className="absolute top-2 right-2 text-xl bg-white/80 dark:bg-[#2a1f2d]/80 rounded-full w-8 h-8 flex items-center justify-center">
                          {pet.gender === "Male" ? "♂️" : "♀️"}
                        </span>
                      </div>
                      <p className="text-center font-medium">{pet.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-2 border-[#9f6fb9] dark:border-[#d4b6e6] rounded-lg p-4">
                <h2 className="text-2xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-4">
                  Select Parent 2
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {savedPets.map((pet) => (
                    <div
                      key={`pet2-${pet.id}`}
                      onClick={() => selectPetForBreeding(pet, "pet2")}
                      className={`cursor-pointer rounded-lg p-2 transition-all ${
                        selectedPets.pet2?.id === pet.id
                          ? "bg-[#9f6fb9] dark:bg-[#d4b6e6] text-white"
                          : "bg-white/50 dark:bg-[#2a1f2d]/50 hover:bg-[#9f6fb9]/20"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={pet.generated_image}
                          alt={pet.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <span className="absolute top-2 right-2 text-xl bg-white/80 dark:bg-[#2a1f2d]/80 rounded-full w-8 h-8 flex items-center justify-center">
                          {pet.gender === "Male" ? "♂️" : "♀️"}
                        </span>
                      </div>
                      <p className="text-center font-medium">{pet.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setSelectedPets({ pet1: null, pet2: null })}
                className="px-6 py-2 bg-[#f0e6ff] dark:bg-[#4a3657] text-[#4a3657] dark:text-[#d4b6e6] rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear Selection
              </button>
              <button
                onClick={breedPets}
                disabled={!canBreed || breedingInProgress}
                className={`px-8 py-4 rounded-lg transition-all duration-300 ${
                  canBreed && !breedingInProgress
                    ? "bg-[#9f6fb9] hover:bg-[#8a5ea4] text-white"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
                }`}
              >
                {breedingInProgress ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Breeding...
                  </span>
                ) : canBreed ? (
                  "✨ Breed Selected Pets ✨"
                ) : (
                  "Select Two Different Gender Pets"
                )}
              </button>
            </div>
          </>
        )}
      </div>
      <BottomNav activeTab="breed" />
      <style jsx global>{`
        @keyframes sparkle {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        .animate-sparkle {
          animation: sparkle 1s ease-in-out;
        }
      `}</style>
    </PageContainer>
  );
}

export default MainComponent;