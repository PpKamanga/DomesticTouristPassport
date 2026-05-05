console.log("admin.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "login.html";
}

document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;

 function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function goHome() {
  window.location.href = "home.html";
}

async function loadAdminDestinations() {
  const response = await fetch("/api/destinations");
  const destinations = await response.json();

  const list = document.getElementById("adminDestinationsList");
  list.innerHTML = "";

  destinations.forEach((destination) => {
    const row = document.createElement("div");
    row.className = "admin-destination-row";

    row.innerHTML = `
      <img 
        src="${destination.image}" 
        alt="${destination.name}" 
        class="admin-destination-img"
      />

      <div class="admin-destination-info">
        <h3>${destination.name}</h3>
        <p>${destination.city}, ${destination.state}</p>
      </div>

      <div class="admin-footprints">
        ${destination.footprints} Footprints
      </div>

      <button onclick="goToDestinationAnalytics(${destination.id})">
        See Analytics
      </button>
    `;

    list.appendChild(row);
  });
}

function goToDestinationAnalytics(destinationId) {
  window.location.href = `destinationanalytics.html?id=${destinationId}`;
}

window.goToDestinationAnalytics = goToDestinationAnalytics;

async function loadAnalytics() {
  const visitsResponse = await fetch("/api/visits");
  const visitsData = await visitsResponse.json();

  const destinationsResponse = await fetch("/api/destinations");
  const destinations = await destinationsResponse.json();

  const visits = visitsData.visits || [];

  const users = new Set(
    visits.map((visit) => visit.username).filter(Boolean)
  );

  document.getElementById("adminTotalUsers").textContent = users.size;
  document.getElementById("adminTotalDestinations").textContent = destinations.length;
  document.getElementById("adminTotalVisits").textContent = visits.length;
}

window.logout = logout;
window.goHome = goHome;
window.goToDestinationAnalytics = goToDestinationAnalytics;

loadAnalytics();
loadAdminDestinations();