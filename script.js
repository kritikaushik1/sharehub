document.addEventListener("DOMContentLoaded", () => {
  // Always start on login page
  localStorage.removeItem("isLoggedIn");

  const loginPage = document.getElementById("login-page");
  const signupPage = document.getElementById("signup-page");
  const mainPage = document.getElementById("main-page");

  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  // Show signup page
  showSignup.addEventListener("click", () => {
    window.location.href = "main.html";

  });

  // Show login page
  showLogin.addEventListener("click", () => {
    
    
    window.location.href = "main.html";

  });

  // Handle login
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return alert("No account found. Please sign up first!");
    if (email === user.email && password === user.password) {
      alert("Login successful!");
      loginPage.classList.add("d-none");
      mainPage.classList.remove("d-none");
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Invalid email or password!");
    }
  });

  // Handle signup
  signupBtn.addEventListener("click", () => {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirm = document.getElementById("signup-confirm").value.trim();

    if (!name || !email || !phone || !password || !confirm)
      return alert("Please fill all fields!");
    if (password !== confirm)
      return alert("Passwords do not match!");

    const user = { name, email, phone, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Account created successfully!");
   window.location.href = "main.html";

  });

  // Handle logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    mainPage.classList.add("d-none");
    loginPage.classList.remove("d-none");
  });
});
