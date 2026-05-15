// Confirms that the admin JavaScript file has loaded successfully
console.log("admin.js loaded");

// Retrieves the currently logged-in user from local storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Prevents non-admin users from accessing the admin dashboard
if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "login.html";
}

// Displays the logged-in admin's username and role on the dashboard
document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;

 // Logs the user out and redirects them to the login page
  function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Redirects the user to the home page
function goHome() {
  window.location.href = "home.html";
}

// Loads all destinations and displays them on the admin dashboard
async function loadAdminDestinations() {
  const response = await fetch("/api/destinations");
  const destinations = await response.json();

   // Selects the destination list container and clears old content
  const list = document.getElementById("adminDestinationsList");
  list.innerHTML = "";

    // Creates a dashboard row for each destination
  destinations.forEach((destination) => {
    console.log(destination.image);
    
    const row = document.createElement("div");
    row.className = "admin-destination-row";

     // Adds destination image, location, footprints, and analytics button
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

// Opens the analytics page for the selected destination
function goToDestinationAnalytics(destinationId) {
  window.location.href = `destinationanalytics.html?id=${destinationId}`;
}

// Makes the analytics navigation function available to inline HTML buttons
window.goToDestinationAnalytics = goToDestinationAnalytics;

// Loads summary analytics for users, destinations, and visits and displays them on the dashboard
async function loadAnalytics() {
  const visitsResponse = await fetch("/api/visits");
  const visitsData = await visitsResponse.json();

  const destinationsResponse = await fetch("/api/destinations");
  const destinations = await destinationsResponse.json();

   // Stores the list of recorded visits
  const visits = visitsData.visits || [];

   // Counts unique users who have recorded visits
  const users = new Set(
    visits.map((visit) => visit.username).filter(Boolean)
  );

   // Updates dashboard summary cards with analytics totals
  document.getElementById("adminTotalUsers").textContent = users.size;
  document.getElementById("adminTotalDestinations").textContent = destinations.length;
  document.getElementById("adminTotalVisits").textContent = visits.length;
}

// Makes navigation functions available globally for HTML onclick events
window.logout = logout;
window.goHome = goHome;
window.goToDestinationAnalytics = goToDestinationAnalytics;

// Loads dashboard data when the page opens
loadAnalytics();
loadAdminDestinations();