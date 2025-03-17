async function handler() {
  try {
    const pets = await sql`
      SELECT * FROM pets 
      ORDER BY created_at DESC
    `;

    return { success: true, pets };
  } catch (error) {
    return { success: false, error: "Failed to fetch pets" };
  }
}