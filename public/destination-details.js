console.log("destination-details.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function goBack() {
  window.location.href = "tourist.html";
}

const destinationImages = {
  "Miss Shirley's Cafe": "images/miss shirleys cafe.jpg",
  "Baltimore National Aquarium": "images/baltimore national aquarium.jpg",
  "Maryland Zoo": "images/maryland zoo.jpg",
  "Everyman Theatre": "images/everyman theatre.jpg",
  "Walter's Museum of Art": "images/walters museum of art.jpg",
  "Baltimore Museum of Industry": "images/baltimore museum of industry.jpg",
  "Maryland Science Center": "images/maryland science center.jpg",
  "Baltimore Museum of Art": "images/baltimore museum of art.jpg",
  "Medieval Times": "images/medieval times.jpg"
};

const destinationDescriptions = {
  "Miss Shirley's Cafe": "Miss Shirley's Cafe is a beloved local eatery in Baltimore, known for its delicious breakfast and brunch offerings, including signature dishes like the Miss Shirley's Chicken and Waffles.",
  "Baltimore National Aquarium": "The Baltimore National Aquarium is one of the city’s most popular attractions, featuring marine life exhibits, sharks, dolphins, and interactive experiences for visitors of all ages.",
  "Maryland Zoo": "The Maryland Zoo offers visitors the opportunity to explore animal exhibits, family-friendly activities, and conservation programs in a large outdoor setting.",
  "Everyman Theatre": "Everyman Theatre is a professional theater in Baltimore known for live performances, classic plays, and engaging cultural experiences in an intimate setting.",
  "Walter's Museum of Art": "The Walters Art Museum showcases a wide collection of art from different cultures and historical periods, making it a major educational and cultural destination.",
  "Baltimore Museum of Industry": "The Baltimore Museum of Industry highlights the city’s industrial history through exhibits on manufacturing, transportation, and innovation.",
  "Maryland Science Center": "The Maryland Science Center features hands-on science exhibits, a planetarium, and educational programs designed for children, students, and families.",
  "Baltimore Museum of Art": "The Baltimore Museum of Art is known for its extensive art collections, rotating exhibitions, and inspiring displays of modern and classical works.",
  "Medieval Times": "Medieval Times offers a dinner-and-tournament experience where guests enjoy themed entertainment, live performances, and medieval-style competitions."
};


// Get destination ID from URL parameters
const params = new URLSearchParams(window.location.search);
const destinationId = params.get("destinationId");

fetch("/api/destinations")
  .then((res) => res.json())
  .then((destinations) => {
    const destination = destinations.find((d) => d.id == destinationId);

    if (!destination) {
      document.querySelector(".destination-card-page").innerHTML =
        "<h2>Destination not found</h2>";
      return;
    }
// Populate the page with destination details
    document.getElementById("name").textContent = destination.name;
    document.getElementById("city").textContent = destination.city;
    document.getElementById("description").textContent = destinationDescriptions[destination.name] || "No description available.";
    document.getElementById("image").src = destinationImages[destination.name] || "https://via.placeholder.com/400x300?text=No+Image";

    // Add event listener to the "Record Visit" button
    document
      .getElementById("recordVisitBtn")
      .addEventListener("click", () => {
        window.location.href = `visit.html?id=${destination.id}`;
      });
  })
  .catch((error) => {
    console.error("Error loading destination:", error);
    document.querySelector(".destination-card-page").innerHTML =
      "<h2>Failed to load destination</h2>";
  });