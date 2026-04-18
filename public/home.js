const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage && currentUser.username) {
  welcomeMessage.textContent = `Welcome, ${currentUser.username}`;
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
function goToAdminLogin() {
  window.location.href = "login.html?role=admin";
}