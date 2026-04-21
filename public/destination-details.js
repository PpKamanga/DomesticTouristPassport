console.log("destination-details.js loaded");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "tourist") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function goToMyVisitsPage() {
  window.location.href = "myvisits.html";
}

function goToQRPage() {
  window.location.href = "qrcheckin.html";
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

  const destinationImages = {
  "Miss Shirley's Cafe": "/images/miss shirleys cafe.jpg",
  "Baltimore National Aquarium": "/images/baltimore national aquarium.jpg",
  "Maryland Zoo": "/images/maryland zoo.jpg",
  "Everyman Theatre": "/images/everyman theatre.jpg",
  "Walter's Museum of Art": "/images/walters museum of art.jpg",
  "Baltimore Museum of Industry": "/images/baltimore museum of industry.jpg",
  "Maryland Science Center": "/images/maryland science center.jpg",
  "Baltimore Museum of Art": "/images/baltimore museum of art.jpg",
  "Medieval Times": "/images/medieval times.avif"
};

const destinationDescriptions = {
  "Miss Shirley's Cafe": `Miss Shirley's Cafe is a beloved local eatery in Baltimore, known for its delicious breakfast and brunch offerings, including signature dishes like the Miss Shirley's Chicken and Waffles.
  Miss Shirley's Cafe offers guests an upscale-casual and exceptional award-winning culinary experience for all-day breakfast, brunch and lunch. Our specialties are rooted in Southern fundamentals and the abundance of fresh ingredients from Maryland. We pride ourselves in beautifully presented plates, prompt and professional service, as well as clean, comfortable and well-maintained premises for our guests.
  
  Located in Baltimore’s bustling Inner Harbor and thriving with Charm City energy, both locals and tourists enjoy the large outdoor patio, all glass Falls Room, and the inviting indoor dining rooms. A Leadership in Energy & Environmental Design (LEED) Platinum Property in Baltimore!
  
  Location:
            Inner Harbor
            750 E. Pratt Street,
            Baltimore, MD 21202,
            443.4BRUNCH
            InnerHarbor@MissShirleys.com

  Operating Hours: Monday - Sunday: 8:00 AM - 3:00 PM

  Average Rating: 
  TripAdvisor: 4.5/5 (based on 1,000+ reviews)
  Google: 4.6/5 (based on 2,000+ reviews)

  Link to menu: <br> <a href="https://www.missshirleys.com/menu/full-menu" target="_blank">View Menu
   </a>
  Link to website: 
  <a href="https://www.missshirleys.com/" target="_blank">Visit Website</a>`, 
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
const destinationId = Number(params.get("destinationId"));
console.log("Destination ID from URL:", destinationId);

fetch("/api/destinations")
  .then((res) => res.json())
  .then((data) => {
    console.log("Destinations data:", data);

    const destination = data.find((d) => d.id == destinationId);

    if (!destination) {
      document.getElementById("name").textContent = "Destination not found";
      return;
    }
    
// Populate the page with destination details
    const cleanName = (destination.name || "").trim();
    console.log("Destination name:", cleanName);

    document.getElementById("name").textContent = destination.name;
    document.getElementById("city").textContent = destination.city || "";
    document.getElementById("description").innerHTML = 
    destinationDescriptions[cleanName] || 
    "No description available.";

    const imageUrl =
      destinationImages[cleanName] ||
      "/images/default.jpg";

      console.log("Image URL:", imageUrl);
      

    const imageEl = document.getElementById("image");

    if (imageEl) {
    imageEl.onload = () => {
      console.log("Image loaded successfully:", imageUrl);
    };

    imageEl.onerror = () => {
      console.log("Image failed to load:", imageUrl);
    };

    imageEl.src = imageUrl;
    imageEl.alt = cleanName;
  }

    // Add event listener to the "Record Visit" button
    document
      .getElementById("recordVisitBtn")
      .addEventListener("click", () => {
        window.location.href = `visit.html?destinationId=${destination.id}`;
      });
  })
  .catch((error) => {
    console.error("Error loading destination:", error);
    document.querySelector(".destination-card-page").innerHTML =
      "<h2>Failed to load destination</h2>";
  });