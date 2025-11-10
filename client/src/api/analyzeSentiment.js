const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export async function analyzeSentiment(text) {
  if (!text || text.trim().length === 0) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/process_text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error("❌ Sentiment API error:", response.statusText);
      throw new Error("Failed to get sentiment");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error("❌ Sentiment API fetch failed:", err);
    return null;
  }
}
