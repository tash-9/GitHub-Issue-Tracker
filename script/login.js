const loginBtn = document.getElementById("login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "admin123") {

      localStorage.setItem("isLoggedIn", "true");

      location.reload();
    } else {
      alert("Invalid username or password");
    }

  });
}
