// Confirms that the tourist dashboard JavaScript file has loaded successfully
console.log("tourist.js loaded");

// Retrieves the currently logged-in user from local storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Stores destination IDs and names for later use when displaying visit records
let destinationsMap = {};

// Prevents users who are not logged in as tourists from accessing this page
if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

// Displays the logged-in tourist's username and role
document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;

  // Stores image paths for each tourist destination
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


// Loads destination data from the backend and displays it as attraction cards
function loadDestinations() {
  fetch("/api/destinations")
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("destinations");
      const select = document.getElementById("destinationId");

       // Clears the destination grid before adding new cards
      grid.innerHTML = "";


 // Creates a card for each destination
      data.forEach(d => {
  destinationsMap[d.id] = d.name;

  // Selects the correct destination image or uses a default image
  const imageUrl =
    destinationImages[d.name] ||
    "images/default.jpg";

    const card = document.createElement("div");
  card.className = "attraction-card";
  
   // Builds the destination card content
  card.innerHTML = `
    <img src="${imageUrl}" alt="${d.name}">
    <h3>${d.name}</h3>
    <p>${d.city}</p>
    <button class="details-btn">See Tourist Attraction</button>
  `;

  // Sends the user to the destination details page when clicked
  card.querySelector(".details-btn").addEventListener("click", () => {
    window.location.href = `destination-details.html?destinationId=${d.id}`;
  });

  // Adds the completed card to the destination grid
  grid.appendChild(card);
});
    })
    .catch(error => {
      // Handles errors that occur while loading destinations
      console.error("Error loading destinations:", error);
    });
}

// Logs the user out and redirects them to the login page
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Redirects the user to the My Visits page
function goToMyVisitsPage() {
  window.location.href = "myvisits.html";
}

// Redirects the user to the visit recording page
function goToVisitPage() {
  window.location.href = "visit.html";
}

// Redirects the user to the QR Check-In page 
function goToQRPage() {
  window.location.href = "qrcheckin.html";
}

// Redirects the user to the home page
function goHome() {
  window.location.href = "home.html";
}

// Sends the user back to the previous page or to the home page if no previous page exists
function goBack() {
  if (document.referrer && document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "home.html";
  }
}

// Shows or hides the visits section on the dashboard
function toggleVisits() {
  const visitsSection = document.getElementById("visitsSection");

  if (visitsSection.style.display === "none") {
    visitsSection.style.display = "block";
    loadVisits();
  } else {
    visitsSection.style.display = "none";
  }
}
// Loads destination cards when the page opens
loadDestinations();

// Loads and displays visit records
async function loadVisits() {
  try {
    const res = await fetch('/api/visits');
    const data = await res.json();

    const visitsList = document.getElementById('visitsList');

    if (!data.visits || data.visits.length === 0) {
      visitsList.innerHTML = "<p>No visits recorded yet.</p>";
      return;
    }

    // Displays visit cards with rating, category scores, footprints, and comments
   visitsList.innerHTML = `
  <div class="visits-grid">
    ${data.visits.map(v => `
      <div class="visit-card">
        <h3>Visit Record</h3>
        <p><strong>Destination:</strong> ${destinationsMap[v.destinationId] || "Unknown"}</p>
        <p><strong>Rating:</strong> ${v.rating}</p>

        <p><strong>Cleanliness:</strong> ${v.cleanliness}</p>
        <p><strong>Safety:</strong> ${v.safety}</p>
        <p><strong>Accessibility:</strong> ${v.accessibility}</p>
        <p><strong>Staff:</strong> ${v.staff}</p>
        <p><strong>Value:</strong> ${v.value}</p>
        <p><strong>Recommend:</strong> ${v.recommend}</p>

        <p><strong>Footprints:</strong> ${v.footprints}</p>
        <p><strong>Comment:</strong> ${v.comment || "None"}</p>
      </div>
    `).join("")}
  </div>
`;

  } catch (err) {
    // Handles errors that occur while loading visits
    console.error(err);
  }
}
