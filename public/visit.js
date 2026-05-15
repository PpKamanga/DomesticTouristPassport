// Confirms that the visit JavaScript file has loaded successfully
console.log("visit.js loaded");

// Retrieves the currently logged-in user from local storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Prevents users who are not logged in as tourists from accessing this page
if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
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

// Redirects the user to the QR Check-In page
function goToQRPage() {
  window.location.href = "qrcheckin.html";
}

// Redirects the user to the My Visits page
function goToMyVisitsPage() {
  window.location.href = "myvisits.html";
}

// Logs the user out and redirects them to the login page
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Loads destination options into the visit form dropdown
fetch("/api/destinations")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("destinationId");

    // Retrieves a previously selected destination, if one exists
    const selectedDestinationId = localStorage.getItem("selectedDestinationId");

     // Clears the dropdown before adding destination options
    select.innerHTML = "";

    // Creates an option for each destination
    data.forEach(d => {
      const option = document.createElement("option");
      option.value = d.id;
      option.textContent = `${d.name} (${d.city})`;

      // Selects the option if it matches the previously selected destination
      if (selectedDestinationId && Number(selectedDestinationId) === d.id) {
        option.selected = true;
      }

      select.appendChild(option);
    });
  })

  .catch(error => {
     // Handles errors that occur while loading destinations
    console.error("Error loading destinations:", error);
  });

// Handles the visit form submission
  document.getElementById("visitForm").addEventListener("submit", function (event) {

  // Prevents the page from refreshing when the form is submitted   
  event.preventDefault();

  // Retrieves visit form values
  const destinationId = document.getElementById("destinationId").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;
  const message = document.getElementById("message");
 
  // Retrieves tourism standards survey responses
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

 // Sends the completed visit record to the backend API 
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

  // Processes the server response after submitting the visit
    .then(async res => {
      const data = await res.json();

      // Displays an error if the visit submission fails
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to submit visit.");
      }

      return data;
    })

      // Handles successful visit submission by showing a success message and resetting the form
    .then(data => {

      // Displays a success message with the earned footprints and badge information  
      message.textContent =
        `Visit recorded successfully for ${data.visit.username}! You earned ${data.visit.footprints} Footprints and received the "${data.visit.badge}" badge.`;

      // Resets the visit form and clears the selected destination from local storage after successful submission
        document.getElementById("visitForm").reset();
      localStorage.removeItem("selectedDestinationId");
    })

      // Catches and displays any errors that occur during the visit submission process
    .catch(error => {
      console.error("Error submitting visit:", error);
      message.textContent = error.message;
    });
});