function renderChart(destinationVisits) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const visitsByDay = [0,0,0,0,0,0,0];

  destinationVisits.forEach((visit) => {
    const day = new Date(visit.date).getDay();
    visitsByDay[day]++;
  });

   const canvas = document.getElementById("visitsChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Destroy previous chart if it exists (prevents duplication)
  if (window.visitsChartInstance) {
    window.visitsChartInstance.destroy();
  }

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
async function loadDestinationAnalytics() {
  const params = new URLSearchParams(window.location.search);
  const destinationId = Number(params.get("id"));

  const visitsResponse = await fetch("/api/visits");
  const visitsData = await visitsResponse.json();

  const destinationsResponse = await fetch("/api/destinations");
  const destinations = await destinationsResponse.json();

  const visits = visitsData.visits || [];

  const destination = destinations.find(
    (d) => Number(d.id) === destinationId
  );

  if (!destination) return;

  document.getElementById("destinationName").textContent = destination.name;
  document.getElementById("destinationLocation").textContent =
    `${destination.city}, ${destination.state}`;

  const destinationVisits = visits.filter(
    (visit) => Number(visit.destinationId) === destinationId
  );

    renderChart(destinationVisits);
}

loadDestinationAnalytics();
    