// Retrieves the currently logged-in user from local storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Prevents users who are not logged in as tourists from accessing the home page
if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

// Selects the welcome message element from the page
const welcomeMessage = document.getElementById("welcomeMessage");

// Displays a personalized welcome message using the user's username
if (welcomeMessage && currentUser.username) {
  welcomeMessage.textContent = `Welcome, ${currentUser.username}`;
}

// Logs the user out and redirects them to the login page
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
// Redirects users to the admin login page
function goToAdminLogin() {
  window.location.href = "login.html?role=admin";
}