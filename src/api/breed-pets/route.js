async function handler({ pet1, pet2 }) {
  try {
    if (pet1.gender === pet2.gender) {
      return {
        success: false,
        error: "Breeding requires one male and one female pet",
      };
    }

    const inheritTrait = (trait1, trait2) => {
      const traits1 = Array.isArray(trait1) ? trait1 : [trait1];
      const traits2 = Array.isArray(trait2) ? trait2 : [trait2];
      const combined = [...traits1, ...traits2];
      const numTraits = Math.floor(Math.random() * 2) + 1;
      const selected = [];

      for (let i = 0; i < numTraits && combined.length > 0; i++) {
        const index = Math.floor(Math.random() * combined.length);
        const trait = combined[index];
        if (!selected.includes(trait)) {
          selected.push(trait);
        }
      }
      return selected;
    };

    const offspringTraits = {
      name: `${pet1.name} × ${pet2.name} Offspring`,
      species: inheritTrait(pet1.species, pet2.species),
      affinity: inheritTrait(pet1.affinity, pet2.affinity),
      color: inheritTrait(pet1.color, pet2.color),
      mutation: inheritTrait(pet1.mutation, pet2.mutation),
      art_style: Math.random() < 0.5 ? pet1.art_style : pet2.art_style,
      gender: Math.random() < 0.5 ? "Male" : "Female",
    };

    const prompt = `A cute magical pet that combines: ${offspringTraits.species.join(
      " and "
    )} species, with ${offspringTraits.color.join(
      " and "
    )} coloring, showing ${offspringTraits.affinity.join(
      " and "
    )} affinity powers, featuring ${offspringTraits.mutation.join(
      " and "
    )} mutations, in ${offspringTraits.art_style} art style`;

    const imageResponse = await fetch(
      `/integrations/stable-diffusion-v-3/?prompt=${encodeURIComponent(prompt)}`
    );

    if (!imageResponse.ok) {
      throw new Error("Failed to generate image");
    }

    const imageData = await imageResponse.json();
    const generatedImage = imageData.data[0];

    const newPet = await sql`
      INSERT INTO pets (
        name, species, affinity, color, mutation, gender, art_style, generated_image
      ) VALUES (
        ${offspringTraits.name},
        ${offspringTraits.species},
        ${offspringTraits.affinity},
        ${offspringTraits.color},
        ${offspringTraits.mutation},
        ${offspringTraits.gender},
        ${offspringTraits.art_style},
        ${generatedImage}
      )
      RETURNING *
    `;

    return {
      success: true,
      offspring: {
        ...newPet[0],
        parents: [pet1.id, pet2.id],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to breed pets",
    };
  }
}