const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SEARCH_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

let allIssues = [];

function updateIssueCounts(issues) {
  const totalCount = document.getElementById("total-count");
  const openCount = document.getElementById("open-count");
  const closedCount = document.getElementById("closed-count");

  if (!totalCount || !openCount || !closedCount) return;

  const currentIssues = Array.isArray(issues) ? issues : [];
  const openIssues = currentIssues.filter(issue => issue.status?.toLowerCase() === "open");
  const closedIssues = currentIssues.filter(issue => issue.status?.toLowerCase() === "closed");

  totalCount.textContent = currentIssues.length;
  openCount.textContent = openIssues.length;
  closedCount.textContent = closedIssues.length;
}

//FETCH ISSUES
async function loadIssues() {
  const container = document.getElementById("issue-container");
  if (!container) return;

  // show loading spinner
  container.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-24 gap-6 text-center">
      <span class="loading loading-spinner w-16 h-16 text-brand-purple"></span>
      <div class="space-y-3">
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">
          Loading Issues...
        </p>
      </div>
    </div>
  `;

  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    allIssues = result.data || [];
    renderIssues(allIssues);
  } catch (e) {
    console.error("Failed to load issues:", e);
    container.innerHTML = `<div class="col-span-full text-center py-20 text-red-500 font-bold">Failed to load issues</div>`;
  }
}

//Modal open function
async function openIssueModal(id) {
  try {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    const issue = data.data;

    const modal = document.getElementById("issue-modal");

    modal.innerHTML = `
      <div class="bg-white rounded-xl max-w-2xl w-full p-8 relative">

        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          ${issue.title}
        </h2>

        <div class="flex items-center gap-3 text-sm mb-4">
          <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            ${issue.status}
          </span>
          <span class="text-gray-500">
            Opened by ${issue.author} • ${issue.createdAt}
          </span>
        </div>

        <div class="flex gap-2 mb-4">
          <span class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
            ${issue.label || "BUG"}
          </span>
          <span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
            HELP WANTED
          </span>
        </div>

        <p class="text-gray-600 mb-6">
          ${issue.description}
        </p>

        <div class="bg-gray-100 p-4 rounded-lg flex justify-between">
          <div>
            <p class="text-sm text-gray-500">Assignee:</p>
            <p class="font-semibold">${issue.author}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Priority:</p>
            <span class="bg-red-500 text-white text-xs px-2 py-1 rounded">
              ${issue.priority}
            </span>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button onclick="closeModal()"
          class="bg-brand-purple text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90">
          Close
          </button>
        </div>

      </div>
    `;

    modal.classList.remove("hidden");

  } catch (error) {
    console.error("Failed to load issue:", error);
  }
}

//Close modal function
function closeModal(){
  document.getElementById("issue-modal").classList.add("hidden");
}

//get issue
async function getSingleIssue(id) {
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
  const data = await res.json();
  return data.data;
}


//RENDER ISSUES
function renderIssues(issues) {
  const container = document.getElementById("issue-container");

  if (!container) return;

  updateIssueCounts(issues);
  container.innerHTML = "";

  issues.forEach(issue => {
    const isClosed = issue.status?.toLowerCase() === "closed";

    const card = document.createElement("div");

    card.className = `bg-white rounded-xl shadow-sm border-t-4 ${
      isClosed ? "border-closed-purple" : "border-open-green"
    } p-6 flex flex-col justify-between hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer`;

    // store status
    card.dataset.status = issue.status?.toLowerCase() || "unknown";

    card.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-4">

          <span class="text-[10px] font-black uppercase px-2 py-1 rounded bg-gray-100 text-gray-500 tracking-tighter">
            ${issue.priority || "Normal"}
          </span>

          <div class="flex items-center gap-2">
            <img 
              src="assets/${isClosed ? "Closed- Status .png" : "Open-Status.png"}"
              alt="${issue.status}"
              class="h-5 w-auto"
            >
            <span class="text-[10px] font-bold text-gray-400 uppercase">
              ${issue.status || "Unknown"}
            </span>
          </div>

        </div>

        <h3 class="font-bold text-gray-800 text-lg leading-tight mb-2">
          ${issue.title}
        </h3>

        <p class="text-sm text-gray-400 line-clamp-3 mb-6">
          ${issue.description}
        </p>
      </div>
    `;

    // click event to open modal
    card.addEventListener("click", () => {
      openIssueModal(issue.id);
    });

    container.appendChild(card);
  });
}


function filterIssues(status) {

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const clickedBtn = document.querySelector(`[onclick="filterIssues('${status}')"]`);
  if (clickedBtn) clickedBtn.classList.add("active");
  
  if (status === "all") {
    renderIssues(allIssues);
  } else {
    renderIssues(
      allIssues.filter(issue => issue.status?.toLowerCase() === status)
    );
  }
}


// SEARCH FUNCTION 
async function handleSearch() {
  const queryInput = document.getElementById("search-input");
  const container = document.getElementById("issue-container");
  if (!queryInput || !container) return;

  const query = queryInput.value.trim();
  if (!query) return renderIssues(allIssues);

  container.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-24 gap-6 text-center">
      <span class="loading loading-spinner w-16 h-16 text-brand-purple"></span>
      <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Searching...</p>
    </div>
  `;

  try {
    const res = await fetch(`${SEARCH_URL}${query}`);
    const result = await res.json();
    renderIssues(result.data || []);
  } catch (e) {
    console.error("Search failed:", e);
    container.innerHTML = `<div class="col-span-full text-center py-20 text-red-500 font-bold">Search failed</div>`;
  }
}


document.addEventListener("DOMContentLoaded", () => {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const loginSection = document.getElementById("login-section");
  const dashboardSection = document.getElementById("dashboard-section");

  if (isLoggedIn) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");

    loadIssues();
  } else {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
  }

  const searchBtn = document.getElementById("search-btn");
  if (searchBtn) searchBtn.addEventListener("click", handleSearch);

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }

}


);
