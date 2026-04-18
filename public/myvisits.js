console.log("myvisit.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function goHome() {
  window.location.href = "home.html";
}
function goToQRPage() {
  window.location.href = "qrcheckin.html";
}

function goToVisitPage() {
  window.location.href = "visit.html";
}

function goBack() {
  if (document.referrer && document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "home.html";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

Promise.all([
  fetch("/api/visits").then(res => res.json()),
  fetch("/api/destinations").then(res => res.json())
])
  .then(([visitsData, destinations]) => {
    const container = document.getElementById("myVisitsContainer");
    const message = document.getElementById("visitsMessage");

    const myVisits = visitsData.visits.filter(
      visit => visit.username === currentUser.username
    );

    if (myVisits.length === 0) {
      message.textContent = "You have not recorded any visits yet.";
      return;
    }

    myVisits.forEach(visit => {
      const destination = destinations.find(
        d => d.id === visit.destinationId
      );

      const destinationName = destination
        ? `${destination.name} (${destination.city})`
        : `Destination ID: ${visit.destinationId}`;

      const card = document.createElement("div");
      card.className = "attraction-card";

      card.innerHTML = `
        <h3>${destinationName}</h3>
        <p><strong>Rating:</strong> ${visit.rating}</p>
        <p><strong>Comment:</strong> ${visit.comment || "No comment"}</p>
        <p><strong>Footprints:</strong> ${visit.footprints}</p>
        <p><strong>Badge:</strong> ${visit.badge}</p>
        <p><strong>Date:</strong> ${new Date(visit.date).toLocaleString()}</p>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error loading my visits:", error);
    document.getElementById("visitsMessage").textContent =
      "Failed to load visits.";
  });