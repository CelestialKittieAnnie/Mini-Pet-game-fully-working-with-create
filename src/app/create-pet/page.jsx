"use client";
import React from "react";
import BottomNav from "../../components/bottom-nav";

function MainComponent() {
  const [petData, setPetData] = useState({
    name: "",
    species: [],
    affinity: [],
    color: [],
    mutation: [],
    gender: "",
    artStyle: "",
    generatedImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const customTraits = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("customTraits") || "{}");
      return {
        species: (stored.species || []).map((t) => t.value),
        affinity: (stored.affinities || []).map((t) => t.value),
        color: (stored.colors || []).map((t) => t.value),
        mutation: (stored.mutations || []).map((t) => t.value),
        artStyle: (stored.artStyles || []).map((t) => t.value),
      };
    }
    return {
      species: [],
      affinity: [],
      color: [],
      mutation: [],
      artStyle: [],
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const breedingData = params.get("traits");
    const offspringData = params.get("offspring");

    if (offspringData) {
      try {
        const offspring = JSON.parse(decodeURIComponent(offspringData));
        setPetData((prev) => ({
          ...prev,
          species: offspring.species || [],
          affinity: offspring.affinity || [],
          color: offspring.color || [],
          mutation: offspring.mutation || [],
          artStyle: offspring.art_style || "",
          generatedImage: offspring.generated_image || null,
          gender: offspring.gender || "",
        }));
      } catch (error) {
        console.error("Error parsing offspring data:", error);
      }
    } else if (breedingData) {
      try {
        const traits = JSON.parse(decodeURIComponent(breedingData));
        setPetData((prev) => ({
          ...prev,
          species: traits.species || [],
          affinity: traits.affinity || [],
          color: traits.color || [],
          mutation: traits.mutation || [],
          artStyle: traits.art_style || "",
        }));
      } catch (error) {
        console.error("Error parsing breeding data:", error);
      }
    }
  }, []);

  const savePet = async () => {
    setSaving(true);
    setError(null);

    try {
      if (!petData.generatedImage) {
        throw new Error("Please generate an image first");
      }

      const response = await fetch("/api/save-pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        throw new Error("Failed to save pet");
      }

      const result = await response.json();

      setPetData({
        name: "",
        species: [],
        affinity: [],
        color: [],
        mutation: [],
        gender: "",
        artStyle: "",
        generatedImage: null,
      });

      alert("Pet saved successfully!");
    } catch (error) {
      console.error("Error saving pet:", error);
      setError(error.message || "Failed to save pet");
      alert("Failed to save pet. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const generateImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `A ${petData.artStyle} style ${petData.species.join(
        " "
      )} with ${petData.color.join(" ")} coloring and ${petData.mutation.join(
        " "
      )}. It has ${petData.affinity.join(" ")} magical powers.`;

      const response = await fetch(
        `/integrations/stable-diffusion-v-3/?prompt=${encodeURIComponent(
          prompt
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setPetData((prev) => ({ ...prev, generatedImage: data.data[0] }));
    } catch (error) {
      console.error("Error generating image:", error);
      setError(error.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };
  const defaultTraits = {
    species: ["Dragon", "Phoenix", "Unicorn", "Griffin", "Kitsune"],
    affinity: ["Fire", "Water", "Earth", "Air", "Light", "Dark"],
    color: ["Red", "Blue", "Green", "Purple", "Gold", "Silver"],
    mutation: ["Wings", "Crystal Growth", "Multiple Tails", "Ethereal Glow"],
  };
  const allTraits = {
    species: [...new Set([...defaultTraits.species, ...customTraits.species])],
    affinity: [
      ...new Set([...defaultTraits.affinity, ...customTraits.affinity]),
    ],
    color: [...new Set([...defaultTraits.color, ...customTraits.color])],
    mutation: [
      ...new Set([...defaultTraits.mutation, ...customTraits.mutation]),
    ],
  };
  const toggleTrait = (category, trait) => {
    setPetData((prev) => ({
      ...prev,
      [category]: prev[category].includes(trait)
        ? prev[category].filter((t) => t !== trait)
        : [...prev[category], trait],
    }));
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-crimson-text text-[#4a3657] dark:text-[#d4b6e6] mb-8 text-center">
          ✨ Create Your Magical Pet ✨
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[#4a3657] dark:text-[#d4b6e6] mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={petData.name}
                onChange={(e) =>
                  setPetData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-[#2a1f2d]/50 border-2 border-[#e6d6ff] dark:border-[#3d2f40]"
              />
            </div>
            <div>
              <label className="block text-[#4a3657] dark:text-[#d4b6e6] mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={petData.gender}
                onChange={(e) =>
                  setPetData((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-[#2a1f2d]/50 border-2 border-[#e6d6ff] dark:border-[#3d2f40]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-[#4a3657] dark:text-[#d4b6e6] mb-2">
                Art Style
              </label>
              <select
                name="artStyle"
                value={petData.artStyle}
                onChange={(e) =>
                  setPetData((prev) => ({ ...prev, artStyle: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-[#2a1f2d]/50 border-2 border-[#e6d6ff] dark:border-[#3d2f40]"
              >
                <option value="">Select Style</option>
                {[
                  ...new Set([
                    "Cartoon",
                    "Realistic",
                    "Pixel Art",
                    "Watercolor",
                    "Anime",
                    "Digital Art",
                    ...customTraits.artStyle,
                  ]),
                ].map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateImage}
              disabled={
                loading ||
                !petData.name ||
                !petData.gender ||
                !petData.artStyle ||
                Object.values(petData).every(
                  (arr) => Array.isArray(arr) && arr.length === 0
                )
              }
              className={`w-full py-3 rounded-lg transition-all duration-300 ${
                loading ||
                !petData.name ||
                !petData.gender ||
                !petData.artStyle ||
                Object.values(petData).every(
                  (arr) => Array.isArray(arr) && arr.length === 0
                )
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#9f6fb9] hover:bg-[#8a5ea4] text-white"
              }`}
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>

            {Object.entries(allTraits).map(([category, traits]) => (
              <div key={category} className="space-y-4">
                <label className="block text-[#4a3657] dark:text-[#d4b6e6] mb-2 capitalize">
                  {category}
                </label>
                <div className="flex flex-wrap gap-2">
                  {traits.map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => toggleTrait(category, trait)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        petData[category].includes(trait)
                          ? "bg-[#9f6fb9] dark:bg-[#d4b6e6] text-white"
                          : "bg-white/50 dark:bg-[#2a1f2d]/50 hover:bg-[#9f6fb9]/20"
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={savePet}
              disabled={saving || !petData.generatedImage}
              className={`w-full py-3 rounded-lg transition-all duration-300 ${
                saving || !petData.generatedImage
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#9f6fb9] hover:bg-[#8a5ea4] text-white"
              }`}
            >
              {saving ? "Saving..." : "Save Pet"}
            </button>

            {error && <div className="text-red-500 text-center">{error}</div>}
          </div>

          <div className="space-y-6">
            {petData.generatedImage ? (
              <img
                src={petData.generatedImage}
                alt="Generated pet"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-64 bg-white/30 dark:bg-[#2a1f2d]/30 rounded-lg flex items-center justify-center">
                <span className="text-[#6b567c] dark:text-[#9f8aa8]">
                  Generated image will appear here
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav activeTab="create" />
    </PageContainer>
  );
}

export default MainComponent;