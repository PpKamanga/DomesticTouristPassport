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
  "Baltimore National Aquarium": `The Baltimore National Aquarium is one of the city’s most popular attractions, featuring marine life exhibits, sharks, dolphins, and interactive experiences for visitors of all ages. It is a private nonprofit organization that connects people with nature to inspire compassion and care for our ocean planet.

   At its heart, the National Aquarium is a place of connection. Its colorful, angular buildings perch on the edge of Baltimore's Inner Harbor, part of the Patapsco River, which flows into the Chesapeake Bay and the ocean beyond. The Aquarium's mission—to connect people with nature to inspire compassion and care for our ocean planet—takes shape within its building and on its campus, but far outside them, too. The Aquarium has always been a place where people of all ages can connect with each other, coming together to share and learn and have fun. As much as the organization has grown and evolved over the decades, its iconic silhouette on Baltimore's Inner Harbor remains steadfast, a symbol of the way the Aquarium's vibrant present and promising future are inextricably linked to its storied past.
   
   Location:
            Inner Harbor
            501 E. Pratt Street,
            Baltimore, MD 21202,
            410-576-3800
            
   Operating Hours: Monday - Thursday: 9:00 AM - 6:00 PM
                    Friday: 9:00 AM - 9:00 PM
                    Saturday: 9:00 AM - 7:00 PM
                    Sunday: 9:00 AM - 6:00 PM
   
    Average Rating: TripAdvisor: 4.5/5 (based on 10,000+ reviews)
                    Google: 4.6/5 (based on 20,000+ reviews)

  Link to website: <br> <a href="https://aqua.org/" target="_blank">Visit Website</a>`,

  "Maryland Zoo": `The Maryland Zoo offers visitors the opportunity to explore animal exhibits, family-friendly activities, and conservation programs in a large outdoor setting.The Zoo’s mission is to engage people in the wonders of the living world through personal encounters with animals, fostering empathy and lifelong support for conservation of wildlife and wild places. The Zoo is home to more than 1,500 animals representing over 200 species, including African lions, giraffes, elephants, and a variety of reptiles and birds. Visitors can enjoy interactive exhibits, educational programs, and special events throughout the year.
  
  Background: 
  The Maryland Zoo, formerly known as the Baltimore Zoo, was created by an act of the Maryland state legislature on April 7, 1876. Its origins in Druid Hill Park date to the early 1860s, well before its formal founding, when the Park Superintendent first began caring for a small collection of animals donated by City residents. The name change occurred in 2004.The Zoo’s 135-plus acre property in Druid Hill Park is owned by the City of Baltimore and leased to the State of Maryland. The Maryland Zoological Society, established in 1967, operates the Zoo under a lease agreement with the state. The Zoological Society assumed full management of the Zoo from the City’s Division of Parks and Recreation in 1984.

  Location:
  1 Safari Pl, 
  Baltimore, 
  MD 21217,
  410-396-7102
  
  Operating Hours: Monday - Sunday: 10:00 AM - 4:00 PM

  Average Rating: TripAdvisor: 4.0/5 (based on 2,000+ reviews)
                  Google: 4.1/5 (based on 3,000+ reviews)

  Link to website: <br> <a href="https://www.marylandzoo.org/" target="_blank">Visit Website</a>`,
  "Everyman Theatre": `Everyman Theatre is a professional theater in Baltimore known for live performances, classic plays, and engaging cultural experiences in an intimate setting. It is an anchor Baltimore arts organization, producing top-notch theatre in its Downtown home. A Resident Company of Artists is central to the organization, featured in both its productions and robust roster of Education programs.  With the values of people, community, and excellence at the core of its programming and operations, Everyman Theatre is dedicated to meaningful connections between artists and audiences both onstage and off and encourages lifelong learning through the artist within all of us. Everyman Theatre contributes to a positive cultural landscape in our city, provides deep engagement with local students, strengthens the community through partnerships, and works to remove barriers to access in all its programming to embody its name, Everyman Theatre.
  
  Background: 
  Everyman Theatre was founded in 1990 by a group of Baltimore artists who wanted to create a space for innovative and socially relevant theater. The theater has since become a cornerstone of Baltimore's arts scene, known for its commitment to producing high-quality productions that reflect the diversity and vibrancy of the city. Everyman Theatre has received numerous awards and accolades for its work, including multiple Helen Hayes Awards and recognition from the American Theatre Wing.
  
  Location:
  315 W Fayette St, 
  Baltimore, 
  MD 21201,
  410-752-2208  
  
  Operating Hours: Varies by performance schedule, typically evening shows from Tuesday to Saturday, with matinees on weekends.
  
  Average Rating: TripAdvisor: 4.5/5 (based on 500+ reviews)
                  Google: 4.6/5 (based on 1,000+ reviews)
                  
  Link to website: <br> <a href="https://www.everymantheatre.org/" target="_blank">Visit Website</a>`,

  "Walter's Museum of Art": `The Walters Art Museum showcases a wide collection of art from different cultures and historical periods, making it a major educational and cultural destination.The Walters Art Museum is among America’s most distinctive museums, forging connections between people and art from cultures around the world and spanning seven millennia. Through its collections, exhibitions, and education programs, the Walters engages the City of Baltimore, Maryland, and audiences across the globe. Located in Baltimore’s Mount Vernon neighborhood, the Walters is free for all. The museum’s campus includes five historic buildings and 36,000 art objects. Moving through the museum’s galleries, visitors encounter a stunning array of objects, from 19th-century paintings of French country and city life to Ethiopian icons, richly illuminated Qur’ans and Gospel books, ancient Roman sarcophagi, and images of the Buddha.
  
  Background:
  The Walters Art Museum was established in 1934 “for the benefit of the public.” Originally called the Walters Art Gallery, the museum started when Henry Walters (1848–1931) bequeathed to the City of Baltimore an extensive art collection begun by his father, William T. Walters (1819–1894), two buildings, and an endowment. While previous descriptions of William and Henry Walters have focused on their roles as philanthropists and art collectors, the museum is now addressing and examining their support of the Confederacy and their Eurocentric collecting. In 2000, the Walters Art Gallery became the Walters Art Museum, a change that reflects the museum’s role as a major public cultural institution. The museum’s original collection and now three of the museum’s five buildings are owned by the City of Baltimore and stewarded by the Walters.
  
  Location:
  600 N Charles St, 
  Baltimore, 
  MD 21201,
  410-547-9000
  
  Operating Hours: Wednesday 10:00 AM - 5:00 PM,
                  Thursday 1:00 PM -8:00 PM,
                  Friday - Sunday: 10:00 AM - 5:00 PM,
                  Closed on Monday and Tuesday.
                  
  Average Rating: TripAdvisor: 4.5/5 (based on 1,000+ reviews)
                  Google: 4.6/5 (based on 2,000+ reviews)
                  
  Link to website: <br> <a href="https://thewalters.org/" target="_blank">Visit Website</a>`,

  "Baltimore Museum of Industry": `The Baltimore Museum of Industry highlights the city’s industrial history through exhibits on manufacturing, transportation, and innovation. It interprets the diverse and significant human stories behind labor and innovation in Baltimore, cultivating a sense of belonging and inspiring visitors to think critically about the intersection of work and society. 
  
  Background:
  The museum was founded in 1977 as a project by the Mayor's office to preserve the industrial history of downtown Baltimore. The museum is located in a former cannery building on the waterfront, which adds to its historical significance. The Baltimore Museum of Industry has become a popular destination for both locals and tourists interested in learning about the city's rich industrial past and its impact on the present.
  
  Location:
  1415 Key Hwy, 
  Baltimore, 
  MD 21230,
  410-727-4808
  
  Operating Hours: Tuesday - Sunday: 09:00 AM - 4:00 PM
                   Closed on Monday.
                   
  Average Rating: TripAdvisor: 4.5/5 (based on 500+ reviews)
                  Google: 4.6/5 (based on 1,000+ reviews)
                  
  Link to website: <br> <a href="https://www.thebmi.org/" target="_blank">Visit Website</a>`,

  "Maryland Science Center": `The Maryland Science Center features hands-on science exhibits, a planetarium, and educational programs designed for children, students, and families. For nearly 50 years, the Maryland Science Center has been a place of discovery and wonder for visitors of all ages. Located in Baltimore's Inner Harbor, the Science Center offers a wide range of interactive exhibits, live demonstrations, and educational programs that inspire curiosity and foster a love of science. From exploring the mysteries of space in the planetarium to engaging with hands-on exhibits on physics, biology, and technology, the Maryland Science Center provides an immersive experience that encourages learning and exploration.
  
  Background:
  The Maryland Science Center was established in 1976 as part of the revitalization efforts for Baltimore's Inner Harbor. The museum has since become a beloved institution in the city, attracting millions of visitors each year. The Science Center is dedicated to promoting science literacy and education through its exhibits and programs, making it a valuable resource for families, students, and educators in the Baltimore area.
  
  Location:
  601 Light St, 
  Baltimore, 
  MD 21230,
  410-685-5225  
  
  Operating Hours: Tuesday - Friday: 10:00 AM - 4:00 PM
                   Saturday - Sunday: 10:00 AM - 5:00 PM
                   Closed on Monday.
                   
  Average Rating: TripAdvisor: 4.5/5 (based on 1,000+ reviews)
                  Google: 4.6/5 (based on 2,000+ reviews)
                  
   Link to website: <br> <a href="https://www.mdsci.org/" target="_blank">Visit Website</a>`,

  "Baltimore Museum of Art": `The Baltimore Museum of Art is known for its extensive art collections, rotating exhibitions, and inspiring displays of modern and classical works.The Baltimore Museum of Art connects art to Baltimore and Baltimore to the world, embodying a commitment to artistic excellence and social equity in every decision from art presentation, interpretation, and collecting, to the composition of our Board of Trustees, staff, and volunteers—creating a museum welcoming to all. Bold, brave, and essential, it is the unwavering vision of the Baltimore Museum of Art to be the most relevant publicly engaged museum in the United States
  
  Background:
  The Baltimore Museum of Art was founded in 1914 with the mission to promote the appreciation of art and to serve as a cultural resource for the city. The museum's collection has grown significantly over the years, thanks to generous donations and acquisitions, and it now houses over 95,000 works of art. The Baltimore Museum of Art is renowned for its collection of modern and contemporary art, as well as its holdings of European paintings, African art, and decorative arts. The museum is committed to making art accessible to all and offers a variety of educational programs and community initiatives.
  
  Location:
  10 Art Museum Dr, 
  Baltimore, 
  MD 21218,
  410-396-7102
  
  operating Hours: Wednesday - Sunday: 10:00 AM - 5:00 PM
                    Thursday: 10:00 AM - 9:00 PM
                   Closed on Monday and Tuesday.
                   
  Average Rating: TripAdvisor: 4.5/5 (based on 1,000+ reviews)
                  Google: 4.6/5 (based on 2,000+ reviews)
                  
  Link to website: <br> <a href="https://artbma.org/" target="_blank">Visit Website</a>`,

  "Medieval Times": `Medieval Times offers a dinner-and-tournament experience where guests enjoy themed entertainment, live performances, and medieval-style competitions. Travel through the mists of time to a forgotten age and a tale of devotion, courage and love—at Medieval Times Dinner & Tournament. Imagine the pageantry and excitement that would have been yours as a guest of the queen ten centuries ago. That’s exactly what you will experience at North America’s most popular dinner attraction. See our electrifying show featuring heroic knights on spirited horses displaying the astounding athletic feats and thrilling swordplay that have become hallmarks of this unique entertainment experience. Enjoy a “hands-on” feast as the dynamic performance unfolds before you. A sweeping musical score and brilliant lights provide a fabulous backdrop for this spellbinding experience that blurs the boundary between fairy tale and spectacle.
  
  Background: 
  Medieval Times is based upon authentic Medieval history and is the true story of a noble family with documentation dating back to the 11th Century. Medieval Times began with two dinner/ entertainment complexes located in Majorca and Benidorm, Spain. The first North American Castle in Kissimmee, Florida opened in December 1983. Medieval Times’ Castles have since entertained more than 72 million guests
  
  Location:
  1 N Decker Ave, 
  Baltimore, 
  MD 21224,
  410-288-6466
  
  Operating Hours: Varies by performance schedule, typically evening shows from Tuesday to Sunday, with matinees on weekends.
  
  Average Rating: TripAdvisor: 4.0/5 (based on 1,000+ reviews)
                  Google: 4.1/5 (based on 2,000+ reviews)
                  
  Link to website: <br> <a href="https://www.medievaltimes.com/locations/baltimore.html" target="_blank">Visit Website</a>`
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