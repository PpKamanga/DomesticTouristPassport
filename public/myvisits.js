// Confirms that the My Visits JavaScript file has loaded successfully
console.log("myvisits.js loaded");

// Retrieves the currently logged-in user from local storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Prevents users who are not logged in as tourists from accessing this page
if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

// Sends the user back to the previous page or to the home page if no previous page exists
function goBack() {
  if (document.referrer && document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "home.html";
  }
}

// Redirects the user to the home page
function goHome() {
  window.location.href = "home.html";
}

// Redirects the user to the QR Check-In page
function goToQRPage() {
  window.location.href = "qrcheckin.html";
}

// Redirects the user to the visit recording page
function goToVisitPage() {
  window.location.href = "visit.html";
}

// Logs the user out and redirects them to the login page
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Stores image paths for each destination
const destinationImages = {
  "Miss Shirley's Cafe": "images/miss shirleys cafe.jpg",
  "Baltimore National Aquarium": "images/baltimore national aquarium.jpg",
  "Maryland Zoo": "images/maryland zoo.jpg",
  "Everyman Theatre": "images/everyman theatre.jpg",
  "Walter's Museum of Art": "images/walters museum of art.jpg",
  "Baltimore Museum of Industry": "images/baltimore museum of industry.jpg",
  "Baltimore Museum of Art": "images/baltimore museum of art.jpg",
  "Maryland Science Center": "images/maryland science center.jpg",
  "Medieval Times": "images/medieval times.avif"
};

// Loads and displays the current user's recorded visits
async function loadMyVisits() {
  const container = document.getElementById("myVisitsContainer");

  try {
    // Fetches visit records from the backend API
    const VisitResponse = await fetch("/api/visits");
    const visitData = await VisitResponse.json();

    // Fetches destination records from the backend API
    const destinationsResponse = await fetch("/api/destinations");
    const destinationsData = await destinationsResponse.json();

    console.log("Visits data:", visitData.visits); 

    // Displays an error message if either API request fails
    if (!VisitResponse.ok || !destinationsResponse.ok) {
      container.innerHTML = "<p>Failed to load visits.</p>";
      return;
    }

    // Filters visits so only the current user's visits are shown
    const myVisits = visitData.visits.filter(
      (visit) => visit.username === currentUser.username
    );

    // Calculates the total footprints earned by the user
    const totalFootprints = myVisits.reduce(
  (sum, visit) => sum + Number(visit.footprints || 0),
  0
);

// Displays the user's name on the digital passport card
document.getElementById("passportUserName").textContent =
  currentUser.username;

// Displays the user's total footprints earned on the digital passport card
  document.getElementById("passportFootprints").textContent =
  `${totalFootprints} Footprints`;

// Displays the user's total number of recorded visits
  document.getElementById("totalVisitsCount").textContent =
  myVisits.length;

  // Counts the number of unique destinations the user has visited
  const uniqueDestinations = new Set(
  myVisits.map((visit) => visit.destinationId)
);

// Displays the number of unique destinations visited
document.getElementById("destinationsVisitedCount").textContent =
  uniqueDestinations.size;

// Uses the most recent visit to display the user's latest badge
  const latestVisit = myVisits[0];

document.getElementById("passportBadge").textContent =
  latestVisit ? latestVisit.badge : "No Badge Yet";

    // Displays a message if the user has not recorded any visits 
  if (myVisits.length === 0) {
      container.innerHTML = "<p>You have not recorded any visits yet.</p>";
      return;
    }

    // Groups visits by destination so repeated visits appear together
    const groupedVisits = {};

    myVisits.forEach((visit) => {
      if (!groupedVisits[visit.destinationId]) {
        groupedVisits[visit.destinationId] = [];
      }
        groupedVisits[visit.destinationId].push(visit);

      });

    // Creates visit cards for each destination the user has visited
      container.innerHTML = Object.keys(groupedVisits)
      .map((destinationId) => {
        const numericDestinationId = Number(destinationId);

         // Finds the destination information for the grouped visits
        const destination = destinationsData.find(
          (d) => d.id === numericDestinationId
        );

      // Skips the card if the destination cannot be found
        if (!destination) return "";

       // Selects the correct image for the destination 
        const imagePath = destinationImages[destination.name] || "images/default.jpg";
        
          // Counts how many times the user visited this destination
        const visitCount = groupedVisits[destinationId].length;

        return `
          <div class="visit-card">
            <img src="${imagePath}" alt="${destination.name}" class="visit-card-image">

            <div class="visit-card-body">
              <h3 class="visit-title">${destination.name}</h3>

              <p><strong>Times Visited:</strong> ${visitCount}</p>

              <button onclick="viewDestination(${numericDestinationId})">
                See Destination
              </button>

               <button onclick="viewFeedback(${numericDestinationId})">
                  See Your Feedback
              </button>
            </div>
          </div>
        `;
      })
      .join("");
    }catch(error) {
    // Handles unexpected errors while loading visit history 
    console.error("Error loading my visits:", error);
    container.innerHTML = "<p>Failed to load visits. Please try again later.</p>";
  }
}

// Opens the destination details page for the selected destination
function viewDestination(destinationId) {
  window.location.href = `destination-details.html?destinationId=${destinationId}`;
}

// Opens the feedback history page for the selected destination
function viewFeedback(destinationId) {
  window.location.href = `feedback.html?destinationId=${destinationId}`;
}

// Loads the user's visits when the page opens
loadMyVisits();