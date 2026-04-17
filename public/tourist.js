console.log("tourist.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;

  const destinationImages = {
    "Miss Shirley's Cafe": "images/miss shirleys cafe.jpg",
  "Baltimore National Aquarium": "images/baltimore national aquarium.jpg",
  "Maryland Zoo": "images/maryland zoo.jpg",
  "Everyman Theatre": "images/everyman theatre.jpg",
  "Walter's Museum of Art": "images/walters museum of art.jpg",
  "Baltimore Museum of Industry": "images/baltimore museum of industry.jpg",
  "Maryland Science Center": "images/maryland science center.jpg",
  "Baltimore Museum of Art": "images/baltimore museum of art.jpg",
  "Medieval Times": "images/medieval times.avif"
};


function loadDestinations() {
  fetch("/api/destinations")
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("destinations");
      const select = document.getElementById("destinationId");
      const totalCount = document.getElementById("total-count");

      grid.innerHTML = "";

      if (totalCount) {
        totalCount.textContent = `Total Tourist Attractions: ${data.length}`;
      }

  data.forEach(d => {
  const imageUrl =
    destinationImages[d.name] ||
    "images/default.jpg";

  const card = document.createElement("div");
  card.className = "attraction-card";
  card.innerHTML = `
    <img src="${imageUrl}" alt="${d.name}">
    <h3>${d.name}</h3>
    <p>${d.city}</p>
      <button class="qr-btn" onclick="event.stopPropagation(); goToQRCheckIn(${d.id})">
    QR Check-In
  </button>
  `;

  card.addEventListener("click", () => {
  window.location.href = `destination-details.html?destinationId=${d.id}`;
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
function goToMyVisitsPage() {
  window.location.href = "myvisits.html";
}
function goToVisitPage() {
  window.location.href = "visit.html";
}

function goToQRPage() {
  window.location.href = "qr.html";
}

function toggleVisits() {
  const visitsSection = document.getElementById("visitsSection");

  if (visitsSection.style.display === "none") {
    visitsSection.style.display = "block";
    loadVisits();
  } else {
    visitsSection.style.display = "none";
  }
}

loadDestinations();
loadFootprints();

async function loadVisits() {
  try {
    const res = await fetch('/api/visits');
    const data = await res.json();

    const visitsList = document.getElementById('visitsList');

    if (!data.visits || data.visits.length === 0) {
      visitsList.innerHTML = "<p>No visits recorded yet.</p>";
      return;
    }

   visitsList.innerHTML = `
  <div class="visits-grid">
    ${data.visits.map(v => `
      <div class="visit-card">
        <h3>Visit Record</h3>
        <p><strong>Destination ID:</strong> ${v.destinationId}</p>
        <p><strong>Rating:</strong> ${v.rating}</p>
        <p><strong>Footprints:</strong> ${v.footprints}</p>
        <p><strong>Comment:</strong> ${v.comment || "None"}</p>
      </div>
    `).join("")}
  </div>
`;

  } catch (err) {
    console.error(err);
  }
}
