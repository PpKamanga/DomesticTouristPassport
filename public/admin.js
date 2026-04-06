console.log("admin.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "login.html";
}

document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;

function loadAnalytics() {
  fetch("/api/visits")
    .then(res => res.json())
    .then(data => {
      const totalVisits = data.visits.length;
      const totalFootprints = data.totalFootprints;

      let averageRating = 0;
      if (data.visits.length > 0) {
        const ratingSum = data.visits.reduce((sum, visit) => sum + visit.rating, 0);
        averageRating = (ratingSum / data.visits.length).toFixed(2);
      }

      document.getElementById("adminTotalVisits").textContent =
        `Total Visits: ${totalVisits}`;

      document.getElementById("adminTotalFootprints").textContent =
        `Total Footprints: ${totalFootprints}`;

      document.getElementById("adminAverageRating").textContent =
        `Average Rating: ${averageRating}`;
    })
    .catch(error => {
      console.error("Error loading analytics:", error);
    });
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

loadAnalytics();