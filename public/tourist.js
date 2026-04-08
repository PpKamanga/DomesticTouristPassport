console.log("tourist.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;

  const destinationImages = {
  "Baltimore National Aquarium": "images/baltimore national aquarium.jpg",
  "Maryland Zoo": "images/maryland zoo.jpg",
  "Everyman Theatre": "images/everyman theatre.jpg",
  "Walter's Museum of Art": "images/walters museum of art.jpg",
  "Baltimore Museum of Industry": "images/baltimore museum of industry.jpg",
  "Maryland Science Center": "images/maryland science center.jpg",
  "Baltimore Museum of Art": "images/baltimore museum of art.jpg",
  "Medieval Times": "images/medieval times.jpg"
};


function loadDestinations() {
  fetch("/api/destinations")
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("destinations");
      const select = document.getElementById("destinationId");
      const totalCount = document.getElementById("total-Count");

      grid.innerHTML = "";

      if (totalCount) {
        totalCount.textContent = `Total Tourist Attractions: ${data.length}`;
      }

  data.forEach(d => {
  const imageUrl =
    destinationImages[d.name] ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80";

  const card = document.createElement("div");
  card.className = "attraction-card";
  card.innerHTML = `
    <img src="${imageUrl}" alt="${d.name}">
    <h3>${d.name}</h3>
    <p>${d.city}</p>
  `;

  card.addEventListener("click", () => {
    localStorage.setItem("selectedDestinationId", d.id);
    window.location.href = "destination.html";
  });

  grid.appendChild(card);
});
    })
    .catch(error => {
      console.error("Error loading destinations:", error);
    });
}
function loadFootprints() {
  fetch("/api/visits")
    .then(res => res.json())
    .then(data => {
      const totalFootprints = document.getElementById("dashboardFootprints");
      if (totalFootprints) {
        totalFootprints.textContent = `Total Footprints: ${data.totalFootprints}`;
      }
    })
    .catch(error => {
      console.error("Error loading footprints:", error);
    });
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
function goToVisitPage() {
  window.location.href = "visit.html";
}

loadDestinations();
loadFootprints();