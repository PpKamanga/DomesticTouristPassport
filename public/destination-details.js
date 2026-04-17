console.log("destination.js loaded");

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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("/api/destinations")
  .then((res) => res.json())
  .then((destinations) => {
    const destination = destinations.find((d) => d.id == id);

    if (!destination) {
      document.querySelector(".destination-card-page").innerHTML =
        "<h2>Destination not found</h2>";
      return;
    }

    document.getElementById("name").textContent = destination.name;
    document.getElementById("city").textContent = destination.city;
    document.getElementById("description").textContent = destination.description;
    document.getElementById("image").src = destination.image;

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