console.log("destination-details.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function goBack() {
  window.location.href = "tourist.html";
}

// Get destination ID from URL parameters
const params = new URLSearchParams(window.location.search);
const destinationId = params.get("destinationId");

fetch("/api/destinations")
  .then((res) => res.json())
  .then((destinations) => {
    const destination = destinations.find((d) => d.id == destinationId);

    if (!destination) {
      document.querySelector(".destination-card-page").innerHTML =
        "<h2>Destination not found</h2>";
      return;
    }
// Populate the page with destination details
    document.getElementById("name").textContent = destination.name;
    document.getElementById("city").textContent = destination.city;
    document.getElementById("description").textContent = destination.description;
    document.getElementById("image").src = destination.image;

    // Add event listener to the "Record Visit" button
    document
      .getElementById("recordVisitBtn")
      .addEventListener("click", () => {
        window.location.href = `visit.html?id=${destination.id}`;
      });
  })
  .catch((error) => {
    console.error("Error loading destination:", error);
    document.querySelector(".destination-card-page").innerHTML =
      "<h2>Failed to load destination</h2>";
  });