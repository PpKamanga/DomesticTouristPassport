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

function loadDestinationInsights() {
  Promise.all([
    fetch("/api/visits").then((res) => res.json()),
    fetch("/api/destinations").then((res) => res.json())
  ])
    .then(([visitsData, destinations]) => {
      const visits = visitsData.visits || [];

      const destinationStats = {};

      destinations.forEach((destination) => {
        destinationStats[destination.id] = {
          id: destination.id,
          name: destination.name,
          visitCount: 0,
          totalRating: 0,
          ratingCount: 0,
          averageRating: 0
        };
      });

      visits.forEach((visit) => {
        const stats = destinationStats[visit.destinationId];
        if (!stats) return;

        stats.visitCount += 1;

        if (visit.rating && visit.rating > 0) {
          stats.totalRating += Number(visit.rating);
          stats.ratingCount += 1;
        }
      });

      Object.values(destinationStats).forEach((stats) => {
        if (stats.ratingCount > 0) {
          stats.averageRating = stats.totalRating / stats.ratingCount;
        }
      });

      const visitedDestinations = Object.values(destinationStats).filter(
        (stats) => stats.visitCount > 0
      );

      const ratedDestinations = Object.values(destinationStats).filter(
        (stats) => stats.ratingCount > 0
      );

      const mostVisited = visitedDestinations.length
        ? visitedDestinations.reduce((max, current) =>
            current.visitCount > max.visitCount ? current : max
          )
        : null;

      const leastVisited = visitedDestinations.length
        ? visitedDestinations.reduce((min, current) =>
            current.visitCount < min.visitCount ? current : min
          )
        : null;

      const bestRated = ratedDestinations.length
        ? ratedDestinations.reduce((best, current) =>
            current.averageRating > best.averageRating ? current : best
          )
        : null;

      document.getElementById("mostVisitedDestination").textContent = mostVisited
        ? `${mostVisited.name} (${mostVisited.visitCount} visits)`
        : "No visits yet";

      document.getElementById("leastVisitedDestination").textContent = leastVisited
        ? `${leastVisited.name} (${leastVisited.visitCount} visits)`
        : "No visits yet";

      document.getElementById("bestRatedDestination").textContent = bestRated
        ? `${bestRated.name} (${bestRated.averageRating.toFixed(1)}/5)`
        : "No ratings yet";

      document.getElementById("destinationRatingsTable").innerHTML =
        Object.values(destinationStats)
          .map(
            (stats) => `
              <tr>
                <td>${stats.name}</td>
                <td>${stats.visitCount}</td>
                <td>${stats.ratingCount > 0 ? stats.averageRating.toFixed(1) : "No ratings"}</td>
              </tr>
            `
          )
          .join("");
    })
    .catch((error) => {
      console.error("Error loading destination insights:", error);
    });
}

function loadAnalytics() {
  fetch(`/api/admin/analytics?role=${currentUser.role}`)
    .then(res => res.json())
 .then(data => {
  document.getElementById("adminTotalVisits").textContent = data.totalVisits;

  document.getElementById("adminTotalFootprints").textContent = data.totalFootprints;

  document.getElementById("adminAverageRating").textContent =
    data.averageRating.toFixed(2);

  document.getElementById("adminActiveUsers").textContent =
    data.activeUsers;
})
.catch(error => {
  console.error("Error loading analytics:", error);
});
}
function loadComments() {
  Promise.all([
    fetch("/api/visits").then((res) => res.json()),
    fetch("/api/destinations").then((res) => res.json())
  ])
    .then(([visitsData, destinations]) => {
      console.log("All visits for comments:", visitsData.visits);
      const commentsList = document.getElementById("adminCommentsList");
  

    const commentedVisits = visitsData.visits.filter(
    (visit) =>
    visit.comment &&
    visit.comment.trim() !== "" &&
    visit.comment !== "QR Check-In"
);

document.getElementById("adminCommentsCount").textContent = commentedVisits.length;

  if (commentedVisits.length === 0) {
  commentsList.innerHTML = `
    <div class="summary-card">
      <h3>No Comments Yet</h3>
      <p>No tourist comments have been submitted yet.</p>
    </div>
  `;
  return;
}

 commentsList.innerHTML = commentedVisits
        .map((visit) => {
          const destination = destinations.find(
            (d) => d.id == visit.destinationId
          );

          const destinationName = destination
            ? destination.name
            : "Unknown Destination";
      return`
            <div class="summary-card">
              <h3>${visit.username || "Tourist"}</h3>
              <p><strong>Destination:</strong> ${destinationName}</p>
              <p><strong>Rating:</strong> ${visit.rating}/5</p>
              <p>${visit.comment}</p>
            </div>
          `;
        })
        
        .join("");
    })
    .catch(error => {
      console.error("Error loading comments:", error);
    });
}

function toggleComments() {
  const commentsSection = document.getElementById("commentsSection");

  if (commentsSection.style.display === "none") {
    commentsSection.style.display = "block";
  } else {
    commentsSection.style.display = "none";
  }
}


loadAnalytics();
loadComments();
loadDestinationInsights();