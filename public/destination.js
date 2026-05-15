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

// Redirects the user to the visit recording page
function goToVisit() {
  window.location.href = "visitpage.html";
}

// Redirects the user to the My Visits page
function goToMyVisitsPage() {
  window.location.href = "myvisits.html";
}

// Redirects the user to the QR Check-In page
function goToQRPage() {
  window.location.href = "qrcheckin.html";
}

// Logs the user out and redirects them to the login page
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Stores image paths for each destination
const destinationImages = {
  "Miss Shirleys Cafe": "images/miss shirleys cafe.jpg",
  "Baltimore National Aquarium": "images/baltimore national aquarium.jpg",
  "Maryland Zoo": "images/maryland zoo.jpg",
  "Everyman Theatre": "images/everyman theatre.jpg",
  "Baltimore Museum of Industry": "images/baltimore museum of industry.jpg",
  "Maryland Science Center": "images/maryland science center.jpg",
  "Baltimore Museum of Art": "images/baltimore museum of art.jpg",
  "Medieval Times": "images/medieval times.jpg"
};

// Retrieves the selected destination ID stored in local storage
const selectedId = localStorage.getItem("selectedDestinationId");

// Fetches all destination data from the backend API
fetch("/api/destinations")
  .then(res => res.json())
  .then(data => {

     // Finds the destination that matches the selected ID
    const destination = data.find(d => d.id == selectedId);

     // Stops execution if the destination is not found
    if (!destination) return;

     // Displays the destination name and city on the page
    document.getElementById("destinationName").textContent = destination.name;
    document.getElementById("destinationCity").textContent = destination.city;

     // Selects the correct destination image or uses a placeholder image if none exists
    const imageUrl =
      destinationImages[destination.name] ||
      "https://via.placeholder.com/300";

       // Displays the destination image
      document.getElementById("destinationImage").src = imageUrl;
  });