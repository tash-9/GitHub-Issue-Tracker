
document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("isLoggedIn") === "true") {

    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");

    if (typeof loadIssues === "function") {
      loadIssues();
    }

  }

});
