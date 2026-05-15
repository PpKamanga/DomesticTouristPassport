// Confirms that the feedback JavaScript file has loaded successfully
console.log("feedback.js loaded");

// Retrieves the currently logged-in user from local storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Prevents users who are not logged in as tourists from accessing this page
if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

// Redirects the user back to the My Visits page
function goBack() {
  window.location.href = "myvisits.html";
}

// Redirects the user to the home page
function goHome() {
  window.location.href = "home.html";
}

// Logs the user out and redirects them to the login page
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Loads and displays the user's feedback for a selected destination
async function loadFeedback() {
  const container = document.getElementById("feedbackContainer");

   // Reads the destination ID from the page URL
  const params = new URLSearchParams(window.location.search);
  const destinationId = Number(params.get("destinationId"));

  try {
    // Fetches visit records from the backend API
    const visitResponse = await fetch("/api/visits");
    const visitData = await visitResponse.json();

     // Fetches destination records from the backend API
    const destinationsResponse = await fetch("/api/destinations");
    const destinationsData = await destinationsResponse.json();

     // Displays an error message if either API request fails
    if (!visitResponse.ok || !destinationsResponse.ok) {
      container.innerHTML = "<p>Failed to load feedback.</p>";
      return;
    }
    
    // Finds the destination that matches the selected destination ID
    const destination = destinationsData.find(
      (d) => d.id === destinationId
    );

    // Displays a message if the destination cannot be found
    if (!destination) {
      container.innerHTML = "<p>Destination not found.</p>";
      return;
    }

     // Filters visits so only the current user's feedback for this destination is shown
    const myFeedback = visitData.visits.filter(
      (visit) =>
        visit.username === currentUser.username &&
        visit.destinationId === destinationId
    );

    // Displays a message if the user has no feedback for this destination
    if (myFeedback.length === 0) {
      container.innerHTML = "<p>No feedback found for this destination.</p>";
      return;
    }

    // Displays the destination name and total number of visits
    container.innerHTML = `
      <div class="details">
        <h2>${destination.name}</h2>
        <p><strong>Number of Times Visited:</strong> ${myFeedback.length}</p>
      </div>
    `;

    // Creates and displays a feedback card for each recorded visit
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
    // Handles unexpected errors while loading feedback
    console.error("Error loading feedback:", error);
    container.innerHTML = "<p>Failed to load feedback. Please try again later.</p>";
  }
}

// Loads feedback history when the page opens
loadFeedback();