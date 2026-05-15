// Confirms that the registration JavaScript file has loaded successfully
console.log("register.js loaded");

// Adds a submit event listener to the registration form
document.getElementById("registerForm").addEventListener("submit", registerUser);

// Handles the user registration process
function registerUser(e) {

    // Prevents the page from refreshing when the form is submitted
  e.preventDefault();

  // Retrieves and trims user input values from the form
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

    // Selects the message display area for showing registration success or error messages
  const message = document.getElementById("registerMessage");

   // Sends the registration data to the backend API
  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

      // Converts registration data into JSON format
    body: JSON.stringify({
      username,
      email,
      password
    })
  })

    // Processes the registration response from the server
    .then(async res => {
      const data = await res.json();

      // Displays an error if registration fails
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    })

      // Handles successful registration by showing a success message and redirecting to the login page
    .then(data => {
      message.textContent = "Account created successfully! Redirecting...";
      
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    })

      // Catches and displays any errors that occur during the registration process
    .catch(err => {
      console.error(err);
      message.textContent = err.message;
    });
}