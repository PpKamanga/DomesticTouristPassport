console.log("myvisit.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function goBack() {
  if (document.referrer && document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "home.html";
  }
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

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

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

async function loadMyVisits() {
  const container = document.getElementById("myVisitsContainer");

  try {
    const VisitResponse = await fetch("/api/visits");
    const visitData = await VisitResponse.json();

    const destinationsResponse = await fetch("/api/destinations");
    const destinationsData = await destinationsResponse.json();

    console.log("Visits data:", visitData.visits); 

    if (!VisitResponse.ok || !destinationsResponse.ok) {
      container.innerHTML = "<p>Failed to load visits.</p>";
      return;
    }

    const myVisits = visitData.visits.filter(
      (visit) => visit.username === currentUser.username
    );

    if (myVisits.length === 0) {
      container.innerHTML = "<p>You have not recorded any visits yet.</p>";
      return;
    }

    const groupedVisits = {};

    myVisits.forEach((visit) => {
      if (!groupedVisits[visit.destinationId]) {
        groupedVisits[visit.destinationId] = [];
      }
        groupedVisits[visit.destinationId].push(visit);

      });

    container.innerHTML = Object.keys(groupedVisits)
      .map((destinationId) => {
        const numericDestinationId = Number(destinationId);

        const destination = destinationsData.find(
          (d) => d.id === numericDestinationId
        );


        if (!destination) return "";

        const imagePath = destinationImages[destination.name] || "images/default.jpg";
        
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
    console.error("Error loading my visits:", error);
    container.innerHTML = "<p>Failed to load visits. Please try again later.</p>";
  }
}

function viewDestination(destinationId) {
  window.location.href = `destination.html?destinationId=${destinationId}`;
}

function viewFeedback(destinationId) {
  window.location.href = `feedback.html?destinationId=${destinationId}`;
}

loadMyVisits();