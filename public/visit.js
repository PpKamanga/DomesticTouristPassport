console.log("visit.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function goHome() {
  window.location.href = "home.html";
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

fetch("/api/destinations")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("destinationId");
    const selectedDestinationId = localStorage.getItem("selectedDestinationId");

    select.innerHTML = "";

    data.forEach(d => {
      const option = document.createElement("option");
      option.value = d.id;
      option.textContent = `${d.name} (${d.city})`;

      if (selectedDestinationId && Number(selectedDestinationId) === d.id) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  })

  .catch(error => {
    console.error("Error loading destinations:", error);
  });

document.getElementById("visitForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const destinationId = document.getElementById("destinationId").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;
  const message = document.getElementById("message");
  const cleanliness = document.getElementById("cleanliness").value;
  const safety = document.getElementById("safety").value;
  const accessibility = document.getElementById("accessibility").value;
  const staff = document.getElementById("staff").value;
  const value = document.getElementById("value").value;
  const recommend = document.getElementById("recommend").value;

  if (!cleanliness || !safety || !accessibility || !staff || !value || !recommend) {
  message.textContent =
    "Please complete the tourism standards survey to earn footprints.";
  return;
}

  fetch("/api/visits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      destinationId: Number(destinationId),
      rating: Number(rating),
      comment: comment,
      cleanliness,
      safety,
      accessibility,
      staff,
      value,
      recommend,
      username: currentUser.username
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
        `Visit recorded successfully for ${data.visit.username}! You earned ${data.visit.footprints} Footprints and received the "${data.visit.badge}" badge.`;

      document.getElementById("visitForm").reset();
      localStorage.removeItem("selectedDestinationId");
    })
    .catch(error => {
      console.error("Error submitting visit:", error);
      message.textContent = error.message;
    });
});