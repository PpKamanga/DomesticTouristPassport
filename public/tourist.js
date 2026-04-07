console.log("tourist.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

document.getElementById("userInfo").textContent =
  `Logged in as ${currentUser.username} (${currentUser.role})`;

document.getElementById("visitForm").addEventListener("submit", submitVisit);

function loadDestinations() {
  fetch("/api/destinations")
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("destinations");
      const select = document.getElementById("destinationId");
      const totalCount = document.getElementById("total-Count");

      grid.innerHTML = "";
      select.innerHTML = "";

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

        const option = document.createElement("option");
        option.value = d.id;
        option.textContent = `${d.name} (${d.city})`;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error loading destinations:", error);
    });
}

function submitVisit(event) {
  event.preventDefault();

  const destinationId = document.getElementById("destinationId").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;
  const message = document.getElementById("message");

  fetch("/api/visits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      destinationId: Number(destinationId),
      rating: Number(rating),
      comment: comment
    })
  })
    .then(async res => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to submit visit.");
      }

      return data;
    })
    .then(data => {
      message.textContent =
        `${data.message}. You earned ${data.visit.footprints} Footprints and received the "${data.visit.badge}" badge.`;

      document.getElementById("visitForm").reset();
      loadVisits();
    })
    .catch(error => {
      console.error("Error submitting visit:", error);
      message.textContent = error.message;
    });
}

function loadVisits() {
  fetch("/api/visits")
    .then(res => res.json())
    .then(data => {
      const visitsList = document.getElementById("visits");
      const totalFootprints = document.getElementById("totalFootprints");

      if (!visitsList || !totalFootprints) {
        console.error("Visits elements not found in HTML");
        return;
      }

      visitsList.innerHTML = "";

      data.visits.forEach(visit => {
        const li = document.createElement("li");
        li.textContent =
          `Visit ${visit.id}: Destination ${visit.destinationId}, Rating ${visit.rating}, ` +
          `Footprints ${visit.footprints}, Badge ${visit.badge}, Comment: ${visit.comment}`;
        visitsList.appendChild(li);
      });

      totalFootprints.textContent = `Total Footprints: ${data.totalFootprints}`;
    })
    .catch(error => {
      console.error("Error loading visits:", error);
    });
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

loadDestinations();