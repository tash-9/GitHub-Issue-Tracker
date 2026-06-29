const BASE_URL = "https://phi-lab-server.vercel.app/api/v1/lab";

async function getIssues() {
  try {
    const res = await fetch(`${BASE_URL}/issues`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return [];
  }
}

async function searchIssues(query) {
  try {
    const res = await fetch(`${BASE_URL}/issues/search?q=${query}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}