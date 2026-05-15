// Creates a line chart showing visits by day of the week
function renderChart(destinationVisits) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Stores the number of visits for each day of the week
  const visitsByDay = [0,0,0,0,0,0,0];

   // Counts each visit based on the day it was recorded
  destinationVisits.forEach((visit) => {
    const day = new Date(visit.date).getDay();
    visitsByDay[day]++;
  });

   // Selects the chart canvas from the page
  const canvas = document.getElementById("visitsChart");

   // Stops the function if the chart canvas does not exist
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Destroy previous chart if it exists (prevents duplication)
  if (window.visitsChartInstance) {
    window.visitsChartInstance.destroy();
  }

   // Creates the visits overview chart using Chart.js
  window.visitsChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: "Visits",
          data: visitsByDay,
          borderColor: "#2e7d32",
          backgroundColor: "rgba(46, 125, 50, 0.2)",
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

// Loads analytics data for the selected destination
async function loadDestinationAnalytics() {

  // Reads the destination ID from the page URL
  const params = new URLSearchParams(window.location.search);
  const destinationId = Number(params.get("id"));

   // Fetches visit records from the backend API
  const visitsResponse = await fetch("/api/visits");
  const visitsData = await visitsResponse.json();

  // Fetches destination records from the backend API
  const destinationsResponse = await fetch("/api/destinations");
  const destinations = await destinationsResponse.json();

   // Stores the list of visits or uses an empty list if no visits exist
  const visits = visitsData.visits || [];

   // Finds the destination that matches the selected destination ID
  const destination = destinations.find(
    (d) => Number(d.id) === destinationId
  );

   // Stops the function if the destination is not found
  if (!destination) return;

   // Displays the destination name and location on the analytics page
  document.getElementById("destinationName").textContent = destination.name;
  document.getElementById("destinationLocation").textContent =
    `${destination.city}, ${destination.state}`;

  
  // Filters visits so only visits for this destination are analyzed
    const destinationVisits = visits.filter(
    (visit) => Number(visit.destinationId) === destinationId
  );

  // Renders the chart using the selected destination's visit data  
  renderChart(destinationVisits);
}


// Loads the destination analytics when the page opens
loadDestinationAnalytics();
    