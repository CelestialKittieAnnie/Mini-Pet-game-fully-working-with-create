async function handler({
  name,
  species,
  affinity,
  color,
  mutation,
  gender,
  artStyle,
  generatedImage,
}) {
  try {
    const result = await sql`
      INSERT INTO pets (name, species, affinity, color, mutation, gender, art_style, generated_image)
      VALUES (${name}, ${species}, ${affinity}, ${color}, ${mutation}, ${gender}, ${artStyle}, ${generatedImage})
      RETURNING *
    `;

    return { success: true, pet: result[0] };
  } catch (error) {
    return { success: false, error: "Failed to save pet" };
  }
}