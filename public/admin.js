console.log("admin.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "login.html";
}

document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;

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
  fetch("/api/visits")
    .then(res => res.json())
    .then(data => {
      console.log("All visits for comments:", data.visits);
      const commentsList = document.getElementById("adminCommentsList");

     const commentedVisits = data.visits.filter(
  visit =>
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
        .map(
          visit => `
            <div class="summary-card">
              <h3>${visit.username || "Tourist"}</h3>
              <p><strong>Destination:</strong> ${visit.destinationId}</p>
              <p><strong>Rating:</strong> ${visit.rating}/5</p>
              <p>${visit.comment}</p>
            </div>
          `
        )
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

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

loadAnalytics();
loadComments();