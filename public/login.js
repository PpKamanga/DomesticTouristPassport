// Confirms that the login JavaScript file has loaded successfully
console.log("login.js loaded");

// Adds a submit event listener to the login form
document.getElementById("loginForm").addEventListener("submit", loginUser);

// Handles the login process when the user submits the form
function loginUser(event) {

   // Prevents the page from refreshing when the form is submitted
  event.preventDefault();

   // Selects form input fields and message display area
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginMessage = document.getElementById("loginMessage");

   // Checks if required form elements exist on the page
  if (!emailInput || !passwordInput || !loginMessage) {
    console.error("Login form elements not found");
    return;
  }

    // Retrieves and trims user input values
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

   // Sends login credentials to the backend API
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

     // Converts login data into JSON format
    body: JSON.stringify({
      email,
      password,
    })
  })

   // Processes the login response from the server
    .then(async res => {
      const data = await res.json();

      // Displays an error if login fails
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    })

     // Handles successful login by storing user data and redirecting based on role
    .then(data => {

       // Stores the logged-in user information in local storage
      localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Displays a success message with the user's role
      loginMessage.textContent = `${data.message}. Logged in as ${data.user.role}.`;

       // Redirects tourists to the tourist home page
      if (data.user.role === "tourist") {
        window.location.href = "home.html";
      }

      // Redirects admins to the admin dashboard      else if (data.user.role === "admin") {
      if (data.user.role === "admin") {
        window.location.href = "admin.html";
      }
    })

     // Handles unexpected login errors
    .catch(error => {
      console.error("Login error:", error);

      // Displays the error message on the page
      loginMessage.textContent = error.message;
    });
}