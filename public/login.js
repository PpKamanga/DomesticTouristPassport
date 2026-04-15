console.log("login.js loaded");

document.getElementById("loginForm").addEventListener("submit", loginUser);

function loginUser(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginMessage = document.getElementById("loginMessage");

  if (!emailInput || !passwordInput || !loginMessage) {
    console.error("Login form elements not found");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
    })
  })
    .then(async res => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    })
    .then(data => {
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      loginMessage.textContent = `${data.message}. Logged in as ${data.user.role}.`;

      if (data.user.role === "tourist") {
        window.location.href = "tourist.html";
      }

      if (data.user.role === "admin") {
        window.location.href = "admin.html";
      }
    })
    .catch(error => {
      console.error("Login error:", error);
      loginMessage.textContent = error.message;
    });
}