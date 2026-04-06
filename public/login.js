console.log("login.js loaded");

document.getElementById("loginForm").addEventListener("submit", loginUser);

function loginUser(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const roleSelect = document.getElementById("role");
  const loginMessage = document.getElementById("loginMessage");

  if (!usernameInput || !passwordInput || !roleSelect || !loginMessage) {
    console.error("Login form elements not found");
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleSelect.value;

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password,
      role
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