console.log("register.js loaded");

document.getElementById("registerForm").addEventListener("submit", registerUser);

function registerUser(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("registerMessage");

  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      email,
      password
    })
  })
    .then(async res => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    })
    .then(data => {
      message.textContent = "Account created successfully! Redirecting...";
      
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    })
    .catch(err => {
      console.error(err);
      message.textContent = err.message;
    });
}