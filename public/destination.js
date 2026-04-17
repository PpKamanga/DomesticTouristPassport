const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function goBack() {
  window.location.href = "tourist.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function goToVisit() {
  window.location.href = "visitpage.html";
}

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

const selectedId = localStorage.getItem("selectedDestinationId");

fetch("/api/destinations")
  .then(res => res.json())
  .then(data => {
    const destination = data.find(d => d.id == selectedId);

    if (!destination) return;

    document.getElementById("destinationName").textContent = destination.name;
    document.getElementById("destinationCity").textContent = destination.city;

    const imageUrl =
      destinationImages[destination.name] ||
      "https://via.placeholder.com/300";

    document.getElementById("destinationImage").src = imageUrl;
  });