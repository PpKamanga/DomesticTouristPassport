console.log("tourist.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;


function loadDestinations() {
  fetch("/api/destinations")
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("destinations");
      const select = document.getElementById("destinationId");
      const totalCount = document.getElementById("total-Count");

      grid.innerHTML = "";

      if (totalCount) {
        totalCount.textContent = `Total Tourist Attractions: ${data.length}`;
      }

      data.forEach(d => {
        const card = document.createElement("div");
        card.className = "attraction-card";
        card.innerHTML = `
          <img src="https://via.placeholder.com/240x220?text=Destination" alt="${d.name}">
          <h3>${d.name}</h3>
        `;
        grid.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error loading destinations:", error);
    });
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
function goToVisitPage() {
  window.location.href = "visit.html";
}

loadDestinations();