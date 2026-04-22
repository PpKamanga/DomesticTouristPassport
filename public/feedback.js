console.log("feedback.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function goBack() {
  window.location.href = "myvisits.html";
}

function goHome() {
  window.location.href = "home.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

async function loadFeedback() {
  const container = document.getElementById("feedbackContainer");
  const params = new URLSearchParams(window.location.search);
  const destinationId = Number(params.get("destinationId"));

  try {
    const visitResponse = await fetch("/api/visits");
    const visitData = await visitResponse.json();

    const destinationsResponse = await fetch("/api/destinations");
    const destinationsData = await destinationsResponse.json();

    if (!visitResponse.ok || !destinationsResponse.ok) {
      container.innerHTML = "<p>Failed to load feedback.</p>";
      return;
    }

    const destination = destinationsData.find(
      (d) => d.id === destinationId
    );

    if (!destination) {
      container.innerHTML = "<p>Destination not found.</p>";
      return;
    }

    const myFeedback = visitData.visits.filter(
      (visit) =>
        visit.username === currentUser.username &&
        visit.destinationId === destinationId
    );

    if (myFeedback.length === 0) {
      container.innerHTML = "<p>No feedback found for this destination.</p>";
      return;
    }

    container.innerHTML = `
      <div class="details">
        <h2>${destination.name}</h2>
        <p><strong>Number of Times Visited:</strong> ${myFeedback.length}</p>
      </div>
    `;

    myFeedback.forEach((visit, index) => {
      container.innerHTML += `
        <div class="visit-card" style="max-width: 600px; margin: 20px auto;">
          <div class="visit-card-body">
            <h3>Visit ${index + 1}</h3>
            <p><strong>Rating:</strong> ${visit.rating ? visit.rating : "No rating"}</p>
            <p><strong>Comment:</strong> ${visit.comment ? visit.comment : "No comment"}</p>
            <p><strong>Date:</strong> ${visit.date ? new Date(visit.date).toLocaleDateString() : "No date"}</p>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading feedback:", error);
    container.innerHTML = "<p>Failed to load feedback. Please try again later.</p>";
  }
}

loadFeedback();